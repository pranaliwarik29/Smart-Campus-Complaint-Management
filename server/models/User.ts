import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  studentId: string;
  password?: string;
  role: 'student' | 'admin';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  studentId: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
