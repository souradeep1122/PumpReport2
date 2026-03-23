require("dotenv").config();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_LINK)
.then(() => console.log("Mongodb Connected"))
.catch((error) => console.log(error));;


mongoose.set("strictQuery", false);

const observationSchema = new mongoose.Schema({
  slNo: Number,
  pumpSpeedRpm: Number,
  suctionGaugeKgCm2: Number,
  deliveryGaugeKgCm2: Number,
  velocityHeadCorrectionM: Number,
  headLossIncreaserReducerM: Number,
  totalHeadM: Number,
  flowM3Hr: Number,
  pumpOutputKW: Number,
  motorInputKW: Number,
  motorEfficiencyPercent: Number,
  pumpInputKW: Number,
  pumpEfficiencyPercent: Number
}, { _id: false });

const ratedSpeedSchema = new mongoose.Schema({
  slNo: Number,
  totalHeadM: Number,
  flowM3Hr: Number,
  powerKW: Number,
  specificGravity: Number,
  pumpEfficiencyPercent: Number,
  nearestDutyPoint: { type: Boolean, default: false }
}, { _id: false });

const vibrationSchema = new mongoose.Schema({
  axialDE: Number,
  axialNDE: Number,
  verticalDE: Number,
  verticalNDE: Number,
  horizontalDE: Number,
  horizontalNDE: Number,
  maxAllowableDE: Number,
  maxAllowableNDE: Number
}, { _id: false });

const leakageSchema = new mongoose.Schema({
  pressureContainment: { type: String, enum: ["YES", "NO"] },
  gasket: { type: String, enum: ["YES", "NO"] },
  mechanicalSealPiping: { type: String, enum: ["YES", "NO"] },
  packingsOrSeal: { type: String }, // e.g. "YES, UNDER CONTROL"
  bearingHousing: { type: String, enum: ["YES", "NO"] }
}, { _id: false });

// ---------------------------------------------------------
// Single Pump Test Structure
// (Used for both True and Altered data blocks)
// ---------------------------------------------------------
const PumpTestSchema = new mongoose.Schema({
  company: {
    name: String,
    address: String
  },

  documentDetails: {
    documentNo: String,
    testCode: String,
    toleranceGrade: String,
    reportNo: String,
    testDate: Date,
    testTime: String,
    customerName: String
  },

  pumpDetails: {
    model: String,
    serialNo: String,
    suctionSizeMm: Number,
    deliverySizeMm: Number,
    impellerDiameterMm: Number,
    impellerType: String
  },

  motorDetails: {
    make: String,
    serialNo: String,
    ratingKW: Number,
    voltageV: Number,
    phase: String,
    frequencyHz: Number,
    speedRpm: Number,
    currentAmps: Number,
    frame: String
  },

  measurementReferences: {
    capacityMeasuredBy: String,
    speedMeasuredBy: String,
    suctionHeadMeasuredBy: String,
    deliveryHeadMeasuredBy: String,
    powerMeasuredBy: String,
    motorEfficiencyReference: String
  },

  testConditions: {
    atmosphericPressureMbar: Number,
    ambientTempC: Number,
    liquidTempC: Number,
    liquidSpecificGravity: Number,
    npshAvailableM: Number
  },

  observations: [observationSchema],

  ratedSpeedData: [ratedSpeedSchema],

  testSummary: {
    testStartedAt: String,
    testEndedAt: String,
    guaranteedTotalHeadM: String,
    guaranteedDischargeM3Hr: String,
    guaranteedEfficiencyPercent: String,
    guaranteedPumpInputKW: String,
    guaranteedSpeedRpm: String,
    drivenThroughVFD: String
  },

  representatives: {
    customerAgency: String,
    manufacturer: String
  },

  tolerances: {
    flowTolerance: Number,
    headTolerance: Number,
    efficiencyTolerance: Number,
    powerTolerance: Number
  },

  mechanicalTest: {
    pumpSerialNo: String,
    modelName: String,
    pumpType: String,
    powerRating: String, // Changed to String as "Below 200 kW" is text

    vibration: vibrationSchema,

    bearingTemperature: {
      deC: Number,
      ndeC: Number
    },

    noiseLevelDBA: String, // Changed to String to support "83~84"

    leakage: leakageSchema,

    freeRunningRotatingParts: { type: String }, // "YES" is string in Excel

    testEngineerName: String
  }

}, { _id: false }); // No ID for the embedded data block

// ---------------------------------------------------------
// Main Comparison Schema
// ---------------------------------------------------------
const PumpTestComparisonSchema = new mongoose.Schema({
  uploadDate: {
    type: Date,
    default: Date.now
  },

  // Stores the data from the "True" file
  trueData: {
    type: PumpTestSchema
   
  },

  // Stores the data from the "Altered" file
  alteredData: {
    type: PumpTestSchema
    
  }

}, { 
  timestamps: true,
  collection: 'pump_test_comparisons2'
});

module.exports = mongoose.model('PumpTestComparison', PumpTestComparisonSchema);