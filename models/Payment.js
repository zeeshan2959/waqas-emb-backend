const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Received', 'Paid'],
    required: true,
    default: 'Received',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  party: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    default: '',
  },
  linkedLot: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
