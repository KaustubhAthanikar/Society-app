// models/Parking.js
import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotNumber: { type: String },
  requestStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.Parking || mongoose.model('Parking', parkingSchema);
