require("dotenv").config();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_LINK)
.then(() => console.log("Mongodb Connected"))
.catch((error) => console.log(error));;


/**
 * User Schema for Authentication
 * Stores login credentials and profile information
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate usernames
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: "" // URL to the user's profile image
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Note: In a production environment, you should use bcrypt to hash passwords 
// before saving. For now, this stores the plain text as requested.

module.exports = mongoose.model('User', UserSchema);