import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  token: {
    type: String
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
