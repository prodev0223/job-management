import mongoose from 'mongoose';
import { UserDocument } from './user.model'

export interface TimesheetDocument extends mongoose.Document {
    user: UserDocument['_id'];
    startDate: string;
    startHour: number;
    startMin: number;
    endDate: string;
    endHour: number;
    endMin: number;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const timesheetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: String },
    startHour: { type: Number },
    startMin: { type: Number },
    endDate: { type: String },
    endHour: { type: Number },
    endMin: { type: Number },
    completed: { type: Boolean, default: false },
}, {
    timestamps: true
})

const TimesheetModel = mongoose.model<TimesheetDocument>("Timesheet", timesheetSchema);

export default TimesheetModel;