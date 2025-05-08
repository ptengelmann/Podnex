const mongoose = require('mongoose');

const PodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  mission: { type: String, required: true, default: "No mission provided" },
  category: { type: String },
  format: { type: String },
  frequency: { type: String },
  duration: { type: String },
  deadline: { type: Date },
  status: { type: String, default: 'draft' },
  urgency: { type: String, default: 'medium' },
  budget: { type: String },
  commitment: { type: String },
  
  // Complex fields with nested objects
  rolesNeeded: [{
    title: { type: String },
    description: { type: String },
    requirements: [{ type: String }],
    compensation: { type: String },
    timeCommitment: { type: String }
  }],
  
  skills: [{ type: String }],
  
  milestones: [{
    title: { type: String },
    description: { type: String },
    deadline: { type: Date },
    deliverables: [{ type: String }]
  }],
  
  requirements: [{ type: String }],
  tags: [{ type: String }],
  visibility: { type: String, default: 'public' },
  timezone: { type: String },
  communication: [{ type: String }],
  tools: [{ type: String }],
  maxMembers: { type: Number, default: 8 },
  
  updates: [{
    date: { type: Date, default: Date.now },
    title: { type: String },
    description: { type: String },
  }],
  
  applicationQuestions: [{ type: String }],
  
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Pod', PodSchema);