const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: { type: String },
  photoURL: { type: String },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
