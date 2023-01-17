import mongoose from 'mongoose';
import { UserDocument } from './user.model'

export interface SessionDocument extends mongoose.Document {
    user: UserDocument['_id'];
    valid: boolean;
    userAgent: string;
    ipAddress?: string;
    city?: string;
    region?: string;
    countryName?: string;
    timezone?: string;
    ipOrg?: string;
    ipAS?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
    ipAddress: { type: String, required: false },
    city: { type: String, required: false },
    region: { type: String, required: false },
    countryName: { type: String, required: false },
    timezone: { type: String, required: false },
    ipOrg: { type: String, required: false },
    ipAS: { type: String, required: false },
}, {
    timestamps: true
})

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;