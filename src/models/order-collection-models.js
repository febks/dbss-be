import mongoose from 'mongoose';

const orderCollectionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    program: {
      code: { type: String, required: true },
      title: { type: String, required: true }
    },
    item: {
      code: { type: String, required: true },
      name: { type: String, required: true }
    },
    registrationId: { type: Number, required: true },
    promoCode: { type: String, required: true },
    registrationBranchCode: { type: String, required: true },
    registrationBranchName: { type: String, required: true },
    pickupPlace: { type: String, required: true },
    pickupBranchCode: { type: String, required: true },
    imageFile: { type: String, required: true },
    status: { type: String, required: true },
    submittedAt: { type: String, required: true },
  },
  { timestamps: true }
)

const Order = mongoose.models.Order || mongoose.model('Order', orderCollectionSchema);
export default Order;