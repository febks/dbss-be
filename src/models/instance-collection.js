import mongoose from 'mongoose';

const instanceSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    resource: { type: String, required: false },
    service: { type: String, required: false },
    status: { type: String, required: true },
    definition: {
      code: { type: String, required: false },
      name: { type: String, required: false },
    },
  },
  { timestamps: true }
);

const Instance = mongoose.models.Instance || mongoose.model('Instance', instanceSchema);
export default Instance;