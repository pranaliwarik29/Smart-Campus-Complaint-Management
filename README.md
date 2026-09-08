# CampusCare — Smart Campus Complaint Management System

**CampusCare** is a full-stack collegiate grievance registration, triage, and resolution management portal. Designed for real-world university campuses, it provides students with a transparent tracking workflow and provides college administrations with an accountable triage desk.

---

## 🏛️ Key Features

### For Students
- **Account Registration & Authentication**: Sign up with college email, Student ID / Roll Number, and bcrypt-hashed password credentials.
- **Lodge Grievances**: Submit complaints across 10 campus departments (Classroom, Hostel, Library, Laboratory, Washroom, Electricity, Wi-Fi, Security, Cleanliness, Other) with custom priority indicators.
- **Evidence Attachment**: Upload and preview photographic evidence (handled via Multer) before submission.
- **Real-Time Ticket Tracking**: View active status badges (`Pending`, `In Review`, `Assigned`, `Resolved`, `Rejected`) and inspect official administration remarks.
- **Audit Timeline**: View chronological event log of ticket transitions with timestamps and responsible authority names.
- **Self-Service Cancellation**: Cancel pending tickets if an issue was resolved independently.

### For Administrators
- **Executive Analytics Dashboard**: Monitor total registered complaints, triage backlogs, resolution rate percentages, and department distribution charts.
- **Advanced Complaints Queue**: Instant keyword search (Ticket ID, title, student name, location) and multi-factor filters (Department, Status, Priority).
- **Work Order Management & Remarks**: Transition statuses, add detailed engineering remarks, adjust priorities, and dispatch technicians.
- **Safety Confirmations**: Confirmation dialogs prevent accidental closures or rejections.

---

## 🏗️ Project Structure

```text
├── server/                       # Backend architecture
│   ├── config/
│   │   └── db.ts                # MongoDB connection & local persistent store with seed data
│   ├── controllers/
│   │   ├── authController.ts    # JWT registration, login, and profile verification
│   │   ├── complaintController.ts # Student CRUD, image processing, & query filters
│   │   └── adminController.ts   # Administrative triage, statistics, & status updates
│   ├── middleware/
│   │   ├── auth.ts              # JWT extraction & role-based route guard
│   │   └── upload.ts            # Multer disk storage and MIME validation
│   ├── models/
│   │   ├── User.ts              # Mongoose User model & TypeScript interface
│   │   └── Complaint.ts         # Mongoose Complaint schema with statusHistory
│   └── routes/
│       ├── authRoutes.ts        # /api/auth
│       ├── complaintRoutes.ts   # /api/complaints
│       └── adminRoutes.ts       # /api/admin
├── src/                          # Frontend architecture
│   ├── components/
│   │   └── common/
│   │       ├── Navbar.tsx       # Institutional top header & user role profile
│   │       ├── Sidebar.tsx      # Responsive dashboard sidebar navigation
│   │       ├── StatusBadge.tsx  # Status and priority badges
│   │       ├── Toast.tsx        # Toast notification provider
│   │       └── ConfirmModal.tsx # Confirmation dialog for critical actions
│   ├── context/
│   │   └── AuthContext.tsx      # Session state, token caching, & role checks
│   ├── pages/
│   │   ├── LandingPage.tsx      # Public landing page with workflow overview
│   │   ├── LoginPage.tsx        # Role-based sign in with quick demo fills
│   │   ├── RegisterPage.tsx     # Student registration form
│   │   ├── student/
│   │   │   ├── StudentDashboard.tsx    # Metric cards, recent complaints, notices
│   │   │   ├── SubmitComplaintPage.tsx # Grievance form with image drag-and-drop
│   │   │   ├── MyComplaintsPage.tsx    # Filterable complaints table
│   │   │   └── ComplaintDetailsPage.tsx# Ticket view, lightbox zoom, audit timeline
│   │   └── admin/
│   │       ├── AdminDashboard.tsx      # KPI stats, department charts, resolution %
│   │       ├── AdminComplaintsPage.tsx # Administrative complaints queue
│   │       └── AdminComplaintDetailsPage.tsx # Triage desk, student profile, remark dispatcher
│   ├── services/
│   │   └── api.ts               # Unified API client handling JSON & FormData
│   ├── types/
│   │   └── index.ts             # Shared frontend TypeScript declarations
│   ├── App.tsx                  # Main router and protected route controller
│   └── main.tsx                 # React DOM root entry
├── uploads/                     # Uploaded evidence images served under /uploads
├── server.ts                    # Express backend and Vite middleware server entry
├── package.json                 # Project dependencies & build scripts
└── README.md
```

---

## 🔑 Sample Credentials for Testing

Pre-configured accounts are seeded for immediate verification:

| Role | Name | Email | Password | Student / Staff ID |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Arthur Mitchell | `admin@campuscare.edu` | `Admin@1234` | `ADMIN-001` |
| **Student** | Alex Rivers | `alex.rivers@college.edu` | `Student@1234` | `CS-2024-042` |
| **Student** | Priya Sharma | `priya.s@college.edu` | `Student@1234` | `EE-2023-118` |

> *Tip: On the Sign-In page, click **"Student Demo"** or **"Admin Demo"** to auto-fill credentials in one click.*

---

## ⚙️ Environment Variables

Create or update your `.env` file with:

```env
# JWT signing key
JWT_SECRET="campuscare_dev_jwt_secret_key_2026"

# MongoDB connection string (Optional)
# If omitted or offline, CampusCare seamlessly uses its built-in persistent datastore
MONGODB_URI="mongodb://127.0.0.1:27017/campuscare"

# Port (Defaults to 3000)
PORT=3000
```

---

## 🚀 Installation & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB
- **Local MongoDB**: Ensure `mongod` is running on `mongodb://127.0.0.1:27017/campuscare`.
- **MongoDB Atlas**: Provide your connection string in `MONGODB_URI`.
- **Zero-Config Fallback**: If MongoDB is not active, CampusCare automatically falls back to its local persistent JSON storage (`server/data/campuscare_store.json`), allowing instant full-fidelity testing without external database setup.

### 3. Run Development Server (Frontend + Backend)
Both Express API routes and Vite frontend are bundled and served together:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm start
```
