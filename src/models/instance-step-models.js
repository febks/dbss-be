import mongoose from 'mongoose';

const instanceStepSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    instanceCode: { type: String, required: true},
    taskName: { type: String, required: true },
    unitComponent: { type: String, required: true },
    unitName: { type: String, required: true },
    unitType: { type: String, required: true },
    taskDescription: { type: String, required: true },
    allowDelegation: { type: Boolean, required: true },
    completionBehavior: { type: String, required: true },
    outcomeAchieved: { type: Boolean, required: true },
    overallOutcome: { type: String, required: true },
  },
  { timestamps: true }
);

const InstanceStep = mongoose.models.InstanceStep || mongoose.model('InstanceStep', instanceStepSchema);
export default InstanceStep;