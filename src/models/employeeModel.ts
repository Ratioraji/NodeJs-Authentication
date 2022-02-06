import { model, Schema } from 'mongoose';
import { Employee } from '../interfaces/EmployeeInterface';



const schema = new Schema<Employee>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password : { type: String, required: true },
    avatar: String,
});

const refreshTokenSchema = new Schema<any>({
    userId : { type: String, required: true },
    jti: String,
});

export const EmployeeModel = model<Employee>('Employee', schema);
export const RefreshTokenModel = model<Employee>('refresh_token', refreshTokenSchema);