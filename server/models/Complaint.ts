import mongoose, { Schema, Document } from 'mongoose';

export type ComplaintCategory =
  | 'Classroom'
  | 'Hostel'
  | 'Library'
  | 'Laboratory'
  | 'Washroom'
  | 'Electricity'
  | 'Wi-Fi / Internet'
  | 'Security'
  | 'Cleanliness'
  | 'Other';

export type ComplaintStatus = 'Pending' | 'In Review' | 'Assigned' | 'Resolved' | 'Rejected';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface IStatusHistory {
  status: ComplaintStatus;
  remark: string;
  changedBy: string;
  timestamp: Date;
}

export interface IComplaint extends Document {
  _id: any;
  complaintId: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  priority: ComplaintPriority;
  image?: string;
  status: ComplaintStatus;
  user: mongoose.Types.ObjectId | string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  adminRemark?: string;
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const StatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Assigned', 'Resolved', 'Rejected'],
    required: true,
  },
  remark: { type: String, default: '' },
  changedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ComplaintSchema = new Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Classroom',
        'Hostel',
        'Library',
        'Laboratory',
        'Washroom',
        'Electricity',
        'Wi-Fi / Internet',
        'Security',
        'Cleanliness',
        'Other',
      ],
      required: true,
    },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Assigned', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, default: '' },
    studentEmail: { type: String, default: '' },
    adminRemark: { type: String, default: '' },
    statusHistory: [StatusHistorySchema],
  },
  { timestamps: true }
);

export const ComplaintModel =
  mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
