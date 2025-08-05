const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
});

module.exports = mongoose.model('Debt', debtSchema);