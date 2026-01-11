const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true},
  password: { type: String, required: true },
  addresses: [{ type: String }],
  role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
}

});

module.exports = mongoose.model('User', userSchema);
