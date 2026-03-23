require("dotenv").config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_LINK)
  .then(async () => {
    console.log("Mongodb Connected");
    
    try {
      const collection = mongoose.connection.db.collection('designs');
      
      // 1. Fetch all current indexes to see what we are working with
      const indexes = await collection.indexes();
      console.log("Current Database Indexes:", indexes.map(i => i.name));

      // 2. Aggressively target and drop the problematic old index
      if (indexes.find(i => i.name === 'serialNo_1')) {
        await collection.dropIndex('serialNo_1');
        console.log("SUCCESS: Old index 'serialNo_1' has been physically deleted.");
      } else {
        console.log("Check: 'serialNo_1' not found. It may have been dropped or named differently.");
      }

      // 3. Optional: If you still get errors, this drops any index that isn't the primary ID or the new compound one
      for (let idx of indexes) {
        if (idx.name !== '_id_' && idx.name !== 'pumpModel_1_serialNo_1') {
           // If there are other rogue unique indexes, we can clear them here if needed
           // await collection.dropIndex(idx.name);
        }
      }

    } catch (err) {
      console.error("Cleanup Execution Error:", err.message);
    }
  })
  .catch((error) => console.log("Connection Error:", error));

const pumpSchema = new mongoose.Schema({
  // Identification
  pumpModel: {
    type: String,
    required: [true, 'Pump Model is required'],
    trim: true,
    index: true
  },
  serialNo: {
    type: String,
    required: [true, 'Serial Number is required'],
    // Ensure this remains just a string without 'unique: true'
    trim: true
  },

  // Performance Metrics
  discharge: {
    type: Number, 
    required: [true, 'Discharge value is required'],
    min: [0, 'Discharge cannot be negative']
  },
  power: {
    type: Number, 
    required: [true, 'Power consumption is required'],
    min: [0, 'Power cannot be negative']
  },
  efficiency: {
    type: Number, 
    required: [true, 'Efficiency percentage is required'],
    min: [0, 'Efficiency cannot be less than 0%'],
    max: [100, 'Efficiency cannot exceed 100%']
  },
  totalHead: {
    type: Number, 
    required: [true, 'Total Head is required'],
    min: [0, 'Total Head cannot be negative']
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * COMPOUND UNIQUE INDEX
 * This is the ONLY index that should be active for uniqueness.
 * It allows the same serialNo to exist for DIFFERENT pumpModels.
 */
pumpSchema.index({ pumpModel: 1, serialNo: 1 }, { unique: true });

// Export the model
module.exports = mongoose.model('Design', pumpSchema);