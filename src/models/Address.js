// const mongoose = require('mongoose');

// const addressSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   fullName: { type: String, required: true },
//   phone: { type: String, required: true },
//   pincode: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   addressLine: { type: String, required: true },
//   landmark: { type: String },
//   isDefault: { type: Boolean, default: false },
// });

// module.exports = mongoose.model('Address', addressSchema);

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    landmark: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
