// models/Visitor.js
import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // resident being visited
  name: { type: String, required: true },
  contact: { type: String, required: true },
  purpose: { type: String },
  flatNo: { type: String, required: false},
  vehicleNo: { type: String },
  validTill: { type: String },
  qrCode: { type: String }, // store QR code image/base64

  status: { 
    type: String, 
    enum: ['pending', 'checked-in', 'checked-out', 'rejected'], 
    default: 'pending' 
  },

  checkInTime: { type: Date },
  checkOutTime: { type: Date },

  // ✅ NEW: Guard Logs
  logs: [
    {
      guardId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      action: { type: String, enum: ['created', 'approved', 'checked-in', 'checked-out', 'rejected'], required: true },
      timestamp: { type: Date, default: Date.now },
      note: { type: String } // optional extra comments
    }
  ]
}, { timestamps: true });

export default mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
