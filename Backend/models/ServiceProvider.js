// models/ServiceProvider.js
import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  category: { type: String, enum: ['housekeeper', 'electrician', 'plumber', 'other'], required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema);
