import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { Complaint, ComplaintStatus, ComplaintPriority } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  Mail,
  IdCard,
  Building,
  Save,
  ZoomIn,
  X,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface AdminComplaintDetailsPageProps {
  complaintId: string;
  onNavigate: (page: string, params?: any) => void;
}

const STATUS_OPTIONS: ComplaintStatus[] = [
  'Pending',
  'In Review',
  'Assigned',
  'Resolved',
  'Rejected',
];

const PRIORITY_OPTIONS: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

export const AdminComplaintDetailsPage: React.FC<AdminComplaintDetailsPageProps> = ({
  complaintId,
  onNavigate,
}) => {
  const { showToast } = useToast();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state for admin edits
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('Pending');
  const [selectedPriority, setSelectedPriority] = useState<ComplaintPriority>('Medium');
  const [adminRemark, setAdminRemark] = useState('');
  const [saving, setSaving] = useState(false);

  // Modals
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [confirmModalText, setConfirmModalText] = useState({ title: '', message: '', isDestructive: false });

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaintById(complaintId);
      setComplaint(res.data);
      setSelectedStatus(res.data.status);
      setSelectedPriority(res.data.priority);
      setAdminRemark(res.data.adminRemark || '');
    } catch (err: any) {
      console.error('Failed to fetch complaint:', err);
      showToast('error', err.message || 'Failed to retrieve complaint record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchDetails();
    }
  }, [complaintId]);

  const executeSave = async () => {
    if (!complaint) return;
    setSaving(true);
    try {
      const res = await api.updateAdminComplaint(complaint._id, {
        status: selectedStatus,
        priority: selectedPriority,
        adminRemark: adminRemark.trim(),
      });
      setComplaint(res.data);
      showToast('success', `Complaint ${res.data.complaintId} updated successfully.`);
      setConfirmModalOpen(false);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update complaint.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    // Check if status is being shifted to Resolved or Rejected, prompt confirmation dialog
    if (selectedStatus === 'Resolved' && complaint.status !== 'Resolved') {
      setConfirmModalText({
        title: 'Mark Grievance as Resolved?',
        message:
          'This confirms all physical/technical repairs have been verified and closes the active ticket. A notification entry will be added to the audit log.',
        isDestructive: false,
      });
      setPendingAction(() => executeSave);
      setConfirmModalOpen(true);
      return;
    }

    if (selectedStatus === 'Rejected' && complaint.status !== 'Rejected') {
      setConfirmModalText({
        title: 'Reject Campus Grievance?',
        message:
          'Are you sure you want to mark this complaint as Rejected (e.g. duplicate, invalid, or outside collegiate jurisdiction)? Please ensure detailed justification remarks are added.',
        isDestructive: true,
      });
      setPendingAction(() => executeSave);
      setConfirmModalOpen(true);
      return;
    }

    executeSave();
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
        Loading administrative complaint file...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900">Complaint Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested complaint does not exist in the collegiate database.
        </p>
        <button
          onClick={() => onNavigate('admin-complaints')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => onNavigate('admin-complaints')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Complaints Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Record ID: {complaint._id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Complaint & Student Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            {/* Badges & Title */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {complaint.complaintId}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                  {complaint.category}
                </span>
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {complaint.title}
              </h1>
            </div>

            {/* Location & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Campus Location</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{complaint.location}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Submission Timestamp</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                Grievance Statement
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200 whitespace-pre-line">
                {complaint.description}
              </p>
            </div>

            {/* Evidence Image */}
            {complaint.image && (
              <div>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Photographic Evidence
                </h3>
                <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden group">
                  <img
                    src={complaint.image}
                    alt="Complaint evidence"
                    className="max-h-64 rounded-lg object-contain bg-slate-100 cursor-pointer"
                    onClick={() => setImageModalOpen(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Click to Zoom</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <User className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Complainant Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Student Name</span>
                <div className="font-semibold text-slate-800 text-sm mt-0.5">
                  {complaint.studentName || 'Alex Rivers'}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Student ID / Roll No</span>
                <div className="font-mono font-semibold text-blue-700 mt-0.5">
                  {complaint.studentId}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Registered Email</span>
                <div className="font-medium text-slate-700 truncate mt-0.5">
                  {complaint.studentEmail || `${complaint.studentId.toLowerCase()}@college.edu`}
                </div>
              </div>
            </div>
          </div>

          {/* Status History Audit Trail */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">Audit History & Event Log</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {complaint.statusHistory?.length || 1} Entries
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.statusHistory?.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={step.status} size="sm" />
                        <span className="font-semibold text-slate-800">{step.changedBy}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {step.remark && (
                      <p className="text-slate-600 leading-relaxed pt-1 font-medium">{step.remark}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Authority Action Controls */}
        <div className="space-y-6">
          <form
            onSubmit={handleSaveClick}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5 sticky top-20"
          >
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Administrative Action</span>
            </div>

            {/* Status Selector */}
            <div>
              <label htmlFor="admin-status-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Update Status
              </label>
              <select
                id="admin-status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Adjustment */}
            <div>
              <label htmlFor="admin-priority-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Triage Priority
              </label>
              <select
                id="admin-priority-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as ComplaintPriority)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {PRIORITY_OPTIONS.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Remarks Textarea */}
            <div>
              <label htmlFor="admin-remark-text" className="block text-xs font-semibold text-slate-700 mb-1">
                Official Administration Remark
              </label>
              <textarea
                id="admin-remark-text"
                rows={4}
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                placeholder="Detail the work order assigned, technician dispatched, or reason for resolution/rejection..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                This message is visible to the student in their portal.
              </span>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                id="save-admin-complaint-btn"
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Dispatch Updates</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Zoom Image Lightbox Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={complaint.image}
              alt="Expanded evidence"
              className="max-h-[80vh] w-auto rounded-lg object-contain bg-black"
            />
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Important Status Transitions */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title={confirmModalText.title}
        message={confirmModalText.message}
        confirmLabel="Confirm & Apply"
        isDestructive={confirmModalText.isDestructive}
        isLoading={saving}
        onConfirm={() => {
          if (pendingAction) pendingAction();
        }}
        onClose={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};
