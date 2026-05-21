import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  session_id: { type: String, default: null },
  contact_name: { type: String, required: true }, 
  selected_photos: { type: String }, 
  frame_choice: { type: String },
  status: { type: String, default: 'SENT', enum: ['PENDING', 'SENT'] }, 
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const RequestModel = mongoose.model('SoftcopyRequest', requestSchema);

export default RequestModel;