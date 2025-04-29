const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  pod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pod',
    required: true,
  },
  roleApplied: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  motivation: {
    type: String,
    required: true,
  },
  portfolioLink: {
    type: String,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
