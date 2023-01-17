import mongoose from 'mongoose';
import { UserDocument } from './user.model';


export interface JobTaskTimeDocument extends mongoose.Document {
    user: UserDocument["_id"];
    taskId: JobTaskDocument["_id"];
    startDay: string;
    startHour: number;
    startMin: number;
    endDay: string | undefined;
    endHour: number | undefined;
    endMin: number | undefined;
    completed?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface JobTaskDocument extends mongoose.Document {
    jobId: string;
    assignedUser: UserDocument["_id"];
    taskType: string;
    taskDescription: string;
    taskRate: number;
    status: string;
    estimatedHours: number;
    xeroId: string;
    timeEntries: [JobTaskTimeDocument["_id"]]
    createdAt: Date;
    updatedAt: Date;
    // saveStartTime(startDay: string, startHour: number, startMin: number): Promise<boolean>
    // saveEndTime(endDay: string, endHour: number, endMin: number): Promise<boolean>
}

const jobTaskSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    taskType: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskRate: { type: Number, required: true },
    status: { type: String, required: true },
    estimatedHours: { type: Number, required: true },
    xeroId: { type: String, required: true },
    timeEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobTaskTime' }]
}, {
    timestamps: true
})

const jobTaskTimeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDay: { type: String },
    startHour: { type: Number },
    startMin: { type: Number },
    endDay: { type: String },
    endHour: { type: Number, required: false },
    endMin: { type: Number, required: false },
    completed: { type: Boolean, required: false },
})

// jobTaskSchema.methods.saveStartTime = async function (startDay: string, startHour: number, startMin: number): Promise<boolean> {
//     const jobTask = this as JobTaskDocument;


//     return true;
// }


const JobTaskModel = mongoose.model<JobTaskDocument>("JobTask", jobTaskSchema);
const JobTaskTimeModel = mongoose.model<JobTaskTimeDocument>("JobTaskTime", jobTaskTimeSchema);

export { JobTaskModel, JobTaskTimeModel };