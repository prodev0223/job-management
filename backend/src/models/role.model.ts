import mongoose from 'mongoose';
import { UserDocument } from './user.model';

export interface RoleDocument extends mongoose.Document {
    name: string;
    users: [UserDocument['_id']];
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true
})

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);

export default RoleModel;