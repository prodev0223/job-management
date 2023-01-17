import mongoose from 'mongoose';

export interface StatusDocument extends mongoose.Document {
    status: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

const statusSchema = new mongoose.Schema({
    status: { type: String, required: true },
    type: { type: String, required: true },
}, {
    timestamps: true
})

const StatusModel = mongoose.model<StatusDocument>("Status", statusSchema);

export default StatusModel;