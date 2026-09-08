export type UserRole = 'student' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  role: UserRole;
  createdAt: string;
}

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

export interface StatusHistoryItem {
  status: ComplaintStatus;
  remark: string;
  changedBy: string;
  timestamp: string;
}

export interface Complaint {
  _id: string;
  complaintId: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  priority: ComplaintPriority;
  image?: string;
  status: ComplaintStatus;
  user: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  adminRemark?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  inReview: number;
  assigned: number;
  resolved: number;
  rejected: number;
  resolutionPercentage: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  recent: Complaint[];
}
