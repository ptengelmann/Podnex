const mongoose = require('mongoose');

const UpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const PodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  format: {
    type: String,
    default: '',
  },
  frequency: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Draft', 'Open', 'In Progress', 'Pre-Launch', 'Live', 'Archived'],
    default: 'Draft',
  },
  rolesNeeded: {
    type: [String],
    default: [],
  },
  updates: {
    type: [UpdateSchema],
    default: [],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Pod', PodSchema);
