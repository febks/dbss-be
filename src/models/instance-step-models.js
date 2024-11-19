import mongoose from 'mongoose';

const instanceStepSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    instanceCode: { type: String, required: true},
    taskName: { type: String, required: true },
    unitComponent: { type: String, required: true },
    unitName: { type: String, required: true },
    unitType: { type: String, required: false },
    taskDescription: { type: String, required: false },
    allowDelegation: { type: Boolean, required: false },
    completionBehavior: { type: String, required: false },
    status: { type: String, required: true },
    outcomeAchieved: { type: Boolean, required: false },
    overallOutcome: { type: String, required: false },
  },
  { timestamps: true }
);

const InstanceStep = mongoose.models.InstanceStep || mongoose.model('InstanceStep', instanceStepSchema);
export default InstanceStep;