const mongoose = require('mongoose');

const PodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mission: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  format: { type: String },
  frequency: { type: String },
  duration: { type: String },
  status: { type: String, default: 'draft' }, // New! default status
  rolesNeeded: { type: [String], default: [] },
  updates: [
    {
      date: { type: Date, default: Date.now },
      title: { type: String },
      description: { type: String },
    }
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Pod', PodSchema);
