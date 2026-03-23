require("dotenv").config();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_LINK)
.then(() => console.log("Mongodb Connected"))
.catch((error) => console.log(error));;


/**
 * User Schema for Authentication with RBAC Support
 */
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      default: "" 
    },
    role: {
      type: String,
      enum: ['MASTER', 'REPORT TEAM', 'DESIGN TEAM', 'USER'],
      default: 'USER'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  

// Note: Ensure passwords are hashed using bcrypt in a production environment.

module.exports = mongoose.model('User', UserSchema);