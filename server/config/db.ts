import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export interface DBUser {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  password: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface DBStatusHistory {
  status: 'Pending' | 'In Review' | 'Assigned' | 'Resolved' | 'Rejected';
  remark: string;
  changedBy: string;
  timestamp: string;
}

export interface DBComplaint {
  _id: string;
  complaintId: string;
  title: string;
  category: string;
  description: string;
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  image?: string;
  status: 'Pending' | 'In Review' | 'Assigned' | 'Resolved' | 'Rejected';
  user: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  adminRemark?: string;
  statusHistory: DBStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

interface DataStore {
  users: DBUser[];
  complaints: DBComplaint[];
  nextComplaintSeq: number;
}

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'campuscare_store.json');

let inMemoryStore: DataStore | null = null;
let isMongoConnected = false;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialSeedData(): DataStore {
  const adminHashed = bcrypt.hashSync('Admin@1234', 10);
  const student1Hashed = bcrypt.hashSync('Student@1234', 10);
  const student2Hashed = bcrypt.hashSync('Student@1234', 10);

  const adminUser: DBUser = {
    _id: 'usr_admin_001',
    name: 'Dr. Arthur Mitchell (Dean of Student Affairs)',
    email: 'admin@campuscare.edu',
    studentId: 'ADMIN-001',
    password: adminHashed,
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  };

  const student1: DBUser = {
    _id: 'usr_student_001',
    name: 'Alex Rivers',
    email: 'alex.rivers@college.edu',
    studentId: 'CS-2024-042',
    password: student1Hashed,
    role: 'student',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
  };

  const student2: DBUser = {
    _id: 'usr_student_002',
    name: 'Priya Sharma',
    email: 'priya.s@college.edu',
    studentId: 'EE-2023-118',
    password: student2Hashed,
    role: 'student',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  };

  const initialComplaints: DBComplaint[] = [
    {
      _id: 'cmp_001',
      complaintId: 'CC-2026-001',
      title: 'Ceiling Projector HDMI Port Damaged in Lecture Hall 3B',
      category: 'Classroom',
      description: 'The projector overhead in Hall 3B produces flickering red artifacts and disconnects intermittently during faculty lectures. The HDMI wall plate port feels loose.',
      location: 'Academic Complex - Lecture Hall 3B (Second Floor)',
      priority: 'High',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      status: 'In Review',
      user: 'usr_student_001',
      studentId: 'CS-2024-042',
      studentName: 'Alex Rivers',
      studentEmail: 'alex.rivers@college.edu',
      adminRemark: 'AV Support technician scheduled inspection for Wednesday afternoon slot.',
      statusHistory: [
        {
          status: 'Pending',
          remark: 'Complaint submitted by student via portal.',
          changedBy: 'Alex Rivers (Student)',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        },
        {
          status: 'In Review',
          remark: 'Verified by Academic Facilities desk. AV Support technician scheduled inspection for Wednesday afternoon slot.',
          changedBy: 'Admin Office',
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmp_002',
      complaintId: 'CC-2026-002',
      title: 'Low Water Pressure and Leaking Tap in 3rd Floor Washroom',
      category: 'Washroom',
      description: 'Water has been constantly trickling from the third faucet on the west side, creating slippery puddles on the tiles. Water pressure in the adjacent taps is very weak.',
      location: 'Engineering Block - West Wing 3rd Floor Restroom',
      priority: 'Urgent',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      status: 'Assigned',
      user: 'usr_student_002',
      studentId: 'EE-2023-118',
      studentName: 'Priya Sharma',
      studentEmail: 'priya.s@college.edu',
      adminRemark: 'Assigned to Campus Maintenance & Plumbing Contractor (Job #PL-889). Replacement washer and seal dispatched.',
      statusHistory: [
        {
          status: 'Pending',
          remark: 'Complaint logged by student.',
          changedBy: 'Priya Sharma (Student)',
          timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
        },
        {
          status: 'In Review',
          remark: 'Inspected by Sanitation supervisor.',
          changedBy: 'Sanitation Dept',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        },
        {
          status: 'Assigned',
          remark: 'Assigned to Campus Maintenance & Plumbing Contractor (Job #PL-889). Replacement washer and seal dispatched.',
          changedBy: 'Admin Office',
          timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmp_003',
      complaintId: 'CC-2026-003',
      title: 'Hostel Block C 2nd Floor Wi-Fi Access Point Frequent Disconnections',
      category: 'Wi-Fi / Internet',
      description: 'The campus wireless SSID "CampusNet-Secure" repeatedly drops connections every 10 minutes in rooms 205-215. Students are unable to access laboratory portals or LMS submit forms.',
      location: 'Boys Hostel Block C - Corridor 2 (Rooms 205-215)',
      priority: 'High',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      status: 'Pending',
      user: 'usr_student_001',
      studentId: 'CS-2024-042',
      studentName: 'Alex Rivers',
      studentEmail: 'alex.rivers@college.edu',
      adminRemark: '',
      statusHistory: [
        {
          status: 'Pending',
          remark: 'Initial report submitted by student.',
          changedBy: 'Alex Rivers (Student)',
          timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmp_004',
      complaintId: 'CC-2026-004',
      title: 'Defective Oscilloscope Power Supply at Signals & Systems Lab',
      category: 'Laboratory',
      description: 'Workbench Station 4 oscilloscope trips the circuit breaker whenever power is engaged. Needs urgent electrical bench test before midterm practical exams next Monday.',
      location: 'Electronics Block - Signals & Systems Lab (Room 108)',
      priority: 'Urgent',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      status: 'Resolved',
      user: 'usr_student_002',
      studentId: 'EE-2023-118',
      studentName: 'Priya Sharma',
      studentEmail: 'priya.s@college.edu',
      adminRemark: 'Internal fuse and capacitor replaced by Lab In-Charge Mr. Rao. Calibrated and tested under load.',
      statusHistory: [
        {
          status: 'Pending',
          remark: 'Reported during lab session.',
          changedBy: 'Priya Sharma (Student)',
          timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        },
        {
          status: 'In Review',
          remark: 'Lab supervisor verified breaker trip.',
          changedBy: 'Lab In-Charge',
          timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
        },
        {
          status: 'Assigned',
          remark: 'Bench repair order issued.',
          changedBy: 'Admin Office',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        },
        {
          status: 'Resolved',
          remark: 'Internal fuse and capacitor replaced by Lab In-Charge Mr. Rao. Calibrated and tested under load.',
          changedBy: 'Chief Engineer',
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmp_005',
      complaintId: 'CC-2026-005',
      title: 'Unattended Food Wrappers and Spill on Reference Reading Tables',
      category: 'Cleanliness',
      description: 'Spilled coffee stains and disposable cups left across reading desks 12 through 15 on the north side of the Central Library.',
      location: 'Central Library - 1st Floor Quiet Reading Zone',
      priority: 'Low',
      image: '',
      status: 'Resolved',
      user: 'usr_student_001',
      studentId: 'CS-2024-042',
      studentName: 'Alex Rivers',
      studentEmail: 'alex.rivers@college.edu',
      adminRemark: 'Housekeeping staff cleared desks and sanitized area at 4:30 PM.',
      statusHistory: [
        {
          status: 'Pending',
          remark: 'Issue reported to desk.',
          changedBy: 'Alex Rivers (Student)',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        },
        {
          status: 'Resolved',
          remark: 'Housekeeping staff cleared desks and sanitized area at 4:30 PM.',
          changedBy: 'Housekeeping Lead',
          timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  return {
    users: [adminUser, student1, student2],
    complaints: initialComplaints,
    nextComplaintSeq: 6,
  };
}

function loadStore(): DataStore {
  if (inMemoryStore) return inMemoryStore;
  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryStore = JSON.parse(data);
      if (inMemoryStore) {
        return inMemoryStore;
      }
    } catch (err) {
      console.warn('Could not read existing campuscare_store.json, creating initial seed data.', err);
    }
  }

  const initial = getInitialSeedData();
  inMemoryStore = initial;
  saveStore();
  return inMemoryStore;
}

function saveStore() {
  if (!inMemoryStore) return;
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to database store file:', err);
  }
}

// Unified Database Service providing reliable CRUD operations
export const dbService = {
  async connect() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        console.log(`Connecting to MongoDB at ${mongoUri.replace(/:[^:@]+@/, ':****@')}...`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        isMongoConnected = true;
        console.log('✓ Successfully connected to MongoDB via Mongoose.');
      } catch (err) {
        console.warn('⚠ MongoDB connection attempt failed, falling back to embedded persistent storage.', err);
        isMongoConnected = false;
      }
    } else {
      console.log('ℹ No MONGODB_URI provided in environment. Running with high-fidelity embedded persistent storage.');
    }
    loadStore();
  },

  isMongo(): boolean {
    return isMongoConnected;
  },

  users: {
    async findByEmail(email: string): Promise<DBUser | null> {
      const store = loadStore();
      const normalized = email.trim().toLowerCase();
      const user = store.users.find((u) => u.email.toLowerCase() === normalized);
      return user ? { ...user } : null;
    },

    async findById(id: string): Promise<DBUser | null> {
      const store = loadStore();
      const user = store.users.find((u) => u._id === id);
      return user ? { ...user } : null;
    },

    async findByStudentId(studentId: string): Promise<DBUser | null> {
      const store = loadStore();
      const norm = studentId.trim().toLowerCase();
      const user = store.users.find((u) => u.studentId.toLowerCase() === norm);
      return user ? { ...user } : null;
    },

    async create(userData: Omit<DBUser, '_id' | 'createdAt'>): Promise<DBUser> {
      const store = loadStore();
      const newUser: DBUser = {
        _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        studentId: userData.studentId.trim(),
        password: userData.password,
        role: userData.role || 'student',
        createdAt: new Date().toISOString(),
      };
      store.users.push(newUser);
      saveStore();
      return { ...newUser };
    },

    async getAll(): Promise<Omit<DBUser, 'password'>[]> {
      const store = loadStore();
      return store.users.map(({ password, ...rest }) => rest);
    },
  },

  complaints: {
    async getAll(filters?: {
      category?: string;
      status?: string;
      priority?: string;
      search?: string;
      studentId?: string;
      userId?: string;
    }): Promise<DBComplaint[]> {
      const store = loadStore();
      let results = [...store.complaints];

      if (filters?.userId) {
        results = results.filter((c) => c.user === filters.userId);
      } else if (filters?.studentId) {
        results = results.filter((c) => c.studentId.toLowerCase() === filters.studentId!.toLowerCase());
      }

      if (filters?.category && filters.category !== 'All') {
        results = results.filter((c) => c.category.toLowerCase() === filters.category!.toLowerCase());
      }

      if (filters?.status && filters.status !== 'All') {
        results = results.filter((c) => c.status.toLowerCase() === filters.status!.toLowerCase());
      }

      if (filters?.priority && filters.priority !== 'All') {
        results = results.filter((c) => c.priority.toLowerCase() === filters.priority!.toLowerCase());
      }

      if (filters?.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        results = results.filter(
          (c) =>
            c.complaintId.toLowerCase().includes(query) ||
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.location.toLowerCase().includes(query) ||
            (c.studentName && c.studentName.toLowerCase().includes(query)) ||
            (c.studentId && c.studentId.toLowerCase().includes(query))
        );
      }

      // Sort newest first
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return results;
    },

    async findById(id: string): Promise<DBComplaint | null> {
      const store = loadStore();
      const comp = store.complaints.find((c) => c._id === id || c.complaintId.toLowerCase() === id.toLowerCase());
      return comp ? { ...comp } : null;
    },

    async create(data: {
      title: string;
      category: string;
      description: string;
      location: string;
      priority: 'Low' | 'Medium' | 'High' | 'Urgent';
      image?: string;
      user: string;
      studentId: string;
      studentName: string;
      studentEmail: string;
    }): Promise<DBComplaint> {
      const store = loadStore();
      const currentYear = new Date().getFullYear();
      const seq = String(store.nextComplaintSeq).padStart(3, '0');
      const complaintId = `CC-${currentYear}-${seq}`;
      store.nextComplaintSeq += 1;

      const nowIso = new Date().toISOString();
      const newComplaint: DBComplaint = {
        _id: 'cmp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        complaintId,
        title: data.title.trim(),
        category: data.category,
        description: data.description.trim(),
        location: data.location.trim(),
        priority: data.priority,
        image: data.image || '',
        status: 'Pending',
        user: data.user,
        studentId: data.studentId,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        adminRemark: '',
        statusHistory: [
          {
            status: 'Pending',
            remark: 'Complaint registered by student.',
            changedBy: data.studentName || 'Student',
            timestamp: nowIso,
          },
        ],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      store.complaints.unshift(newComplaint);
      saveStore();
      return { ...newComplaint };
    },

    async update(
      id: string,
      updates: {
        status?: 'Pending' | 'In Review' | 'Assigned' | 'Resolved' | 'Rejected';
        adminRemark?: string;
        changedBy?: string;
        priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
      }
    ): Promise<DBComplaint | null> {
      const store = loadStore();
      const index = store.complaints.findIndex((c) => c._id === id || c.complaintId === id);
      if (index === -1) return null;

      const comp = store.complaints[index];
      const nowIso = new Date().toISOString();

      if (updates.priority) {
        comp.priority = updates.priority;
      }

      if (updates.adminRemark !== undefined) {
        comp.adminRemark = updates.adminRemark;
      }

      if (updates.status && updates.status !== comp.status) {
        comp.status = updates.status;
        comp.statusHistory.push({
          status: updates.status,
          remark: updates.adminRemark || `Status updated to ${updates.status}`,
          changedBy: updates.changedBy || 'Administrator',
          timestamp: nowIso,
        });
      } else if (updates.adminRemark && updates.changedBy) {
        // Remark added without status change
        comp.statusHistory.push({
          status: comp.status,
          remark: updates.adminRemark,
          changedBy: updates.changedBy,
          timestamp: nowIso,
        });
      }

      comp.updatedAt = nowIso;
      saveStore();
      return { ...comp };
    },

    async delete(id: string): Promise<boolean> {
      const store = loadStore();
      const initialLength = store.complaints.length;
      store.complaints = store.complaints.filter((c) => c._id !== id && c.complaintId !== id);
      if (store.complaints.length !== initialLength) {
        saveStore();
        return true;
      }
      return false;
    },

    async getStats(): Promise<{
      total: number;
      pending: number;
      inReview: number;
      assigned: number;
      resolved: number;
      rejected: number;
      resolutionPercentage: number;
      byCategory: Record<string, number>;
      byPriority: Record<string, number>;
    }> {
      const store = loadStore();
      const total = store.complaints.length;
      let pending = 0;
      let inReview = 0;
      let assigned = 0;
      let resolved = 0;
      let rejected = 0;

      const byCategory: Record<string, number> = {};
      const byPriority: Record<string, number> = {};

      for (const c of store.complaints) {
        if (c.status === 'Pending') pending++;
        else if (c.status === 'In Review') inReview++;
        else if (c.status === 'Assigned') assigned++;
        else if (c.status === 'Resolved') resolved++;
        else if (c.status === 'Rejected') rejected++;

        byCategory[c.category] = (byCategory[c.category] || 0) + 1;
        byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
      }

      const resolutionPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

      return {
        total,
        pending,
        inReview,
        assigned,
        resolved,
        rejected,
        resolutionPercentage,
        byCategory,
        byPriority,
      };
    },
  },
};
