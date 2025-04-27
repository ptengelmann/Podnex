const mongoose = require('mongoose');

const PodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rolesNeeded: {
    type: [String],
    default: [],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Pod', PodSchema);
