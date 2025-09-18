import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },       // added
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  dueDate: { type: Date },                        // added
  paymentDate: { type: Date },                    // optional for resident payment
  receiptUrl: { type: String }
}, { timestamps: true });

export default mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema);
