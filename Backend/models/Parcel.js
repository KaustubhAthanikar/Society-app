// models/Parcel.js
import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parcelDetails: { type: String },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // guard
  status: { type: String, enum: ['pending', 'collected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.models.Parcel ||  mongoose.model('Parcel', parcelSchema);
