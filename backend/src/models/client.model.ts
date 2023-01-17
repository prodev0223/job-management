import mongoose from 'mongoose';

export interface ClientDocument extends mongoose.Document {
    name: string;
    contact?: string;
    email?: string;
    phoneNumber?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
    website?: string;
    taxNumber?: string;
    qbbcNumber?: string;
    isActive: boolean;
    xeroId?: string;
    teamsId: string;
    createdAt: Date;
    updatedAt: Date;
}

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    contact: { type: String, required: false },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    streetAddress1: { type: String, required: false },
    streetAddress2: { type: String, required: false },
    city: { type: String, required: false },
    postcode: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    website: { type: String, required: false },
    taxNumber: { type: String, required: false },
    qbbcNumber: { type: String, required: false },
    isActive: { type: Boolean, required: true, default: true },
    xeroId: { type: String, required: false },
    teamsId: { type: String, required: true }
}, {
    timestamps: true
})

const ClientModel = mongoose.model<ClientDocument>("Client", clientSchema);

export default ClientModel;