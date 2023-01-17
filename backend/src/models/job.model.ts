import mongoose from 'mongoose';
import { ClientDocument } from './client.model';
import { StatusDocument } from './status.model';

export interface JobDocument extends mongoose.Document {
    jobNo: number;
    dateSubmitted: Date;
    client: ClientDocument["_id"];
    contact: {
        name: string;
        phone: string;
        email: string;
    }
    address: {
        streetAddress1: string;
        streetAddress2?: string;
        city: string;
        postcode: string;
        state: string;
        country: string;
    }
    description: string;
    doAndCharge: boolean;
    jobStatus: StatusDocument["_id"];
    quoteStatus: StatusDocument["_id"];
    reqDateOfQuote: Date;
    followUpDate: Date;
    completedDate?: Date;
    estimator: string;
    contractorNotes: string;
    notes: string;
    fileReference: string;
    xeroReference: string;
    createdAt: Date;
    updatedAt: Date;
    // saveStartTime(startDay: string, startHour: number, startMin: number): Promise<boolean>
    // saveEndTime(endDay: string, endHour: number, endMin: number): Promise<boolean>
}

const jobSchema = new mongoose.Schema({
    jobNo: { type: Number, required: true, unique: true },
    dateSubmitted: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    contact: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    address: {
        streetAddress1: { type: String, required: true },
        streetAddress2: { type: String, required: false },
        city: { type: String, required: true },
        postcode: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true }
    },
    description: { type: String, required: true },
    doAndCharge: { type: Boolean, required: true, default: false },
    jobStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
    quoteStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
    reqDateOfQuote: { type: Date, required: true },
    followUpDate: { type: Date, required: true },
    completedDate: { type: Date, required: false },
    estimator: { type: String, required: true },
    contractorNotes: { type: String, required: false },
    notes: { type: String, required: false },
    fileReference: { type: String, required: true },
    xeroReference: { type: String, required: true }
}, {
    timestamps: true
})

// jobTaskSchema.methods.saveStartTime = async function (startDay: string, startHour: number, startMin: number): Promise<boolean> {
//     const jobTask = this as JobTaskDocument;


//     return true;
// }


const JobModel = mongoose.model<JobDocument>("Job", jobSchema);

export default JobModel;