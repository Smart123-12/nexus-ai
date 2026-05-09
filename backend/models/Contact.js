const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true },
  company: String,
  type: String,
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Contact', ContactSchema);
