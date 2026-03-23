require("dotenv").config();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_LINK)
.then(() => console.log("Mongodb Connected"))
.catch((error) => console.log(error));;


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
    unique: true, // Prevents duplicate entries for the same physical unit
    trim: true
  },

  // Performance Metrics
  discharge: {
    type: Number, // Unit: m3/hr
    required: [true, 'Discharge value is required'],
    min: [0, 'Discharge cannot be negative']
  },
  power: {
    type: Number, // Unit: Kw
    required: [true, 'Power consumption is required'],
    min: [0, 'Power cannot be negative']
  },
  efficiency: {
    type: Number, // Unit: %
    required: [true, 'Efficiency percentage is required'],
    min: [0, 'Efficiency cannot be less than 0%'],
    max: [100, 'Efficiency cannot exceed 100%']
  },
  totalHead: {
    type: Number, // Unit: MWC (Meters of Water Column)
    required: [true, 'Total Head is required'],
    min: [0, 'Total Head cannot be negative']
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
module.exports = mongoose.model('Design', pumpSchema);

 