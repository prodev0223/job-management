import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import { RoleDocument } from './role.model';
import { JobTaskDocument } from './jobtask.model';

export interface UserDocument extends mongoose.Document {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    password?: string;
    pinCode?: number;
    employeeId?: number;
    activeTask?: JobTaskDocument["_id"];
    xero?: {
        employeeId?: string;
        earningsRateId?: string;
        currentTimesheetId?: string;
        previousTimesheetId?: string;
    };
    roleId?: RoleDocument['_id'];
    azureUser?: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>
    comparePinCode(candidatePinCode: number): Promise<boolean>
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    employeeId: { type: Number, required: false, unique: true },
    activeTask: { type: mongoose.Schema.Types.ObjectId, ref: 'JobTask', required: false },
    xero: {
        employeeId: { type: String, required: false },
        earningsRateId: { type: String, required: false },
        currentTimesheetId: { type: String, required: false },
        previousTimesheetId: { type: String, required: false }
    },
    pinCode: { type: Number, required: false, },
    password: { type: String, required: false },
    picture: { type: String, required: false },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: false },
    azureUser: { type: Boolean, required: false },
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    let user = this as UserDocument;

    if (!user.isModified('password')) {
        return next();
    }

    if (user.password) {
        const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'))
        const hash = await bcrypt.hashSync(user.password, salt);

        user.password = hash;

        return next();
    }

})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;

    if (user.password) {
        return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
    } else {
        return false
    }
}

userSchema.methods.comparePinCode = async function (candidatePinCode: number): Promise<boolean> {
    const user = this as UserDocument;

    return candidatePinCode === user.pinCode ? true : false;
}

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;


