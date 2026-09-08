import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { Complaint } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
  FileText,
  AlertTriangle,
  ZoomIn,
  X,
  Trash2,
  RefreshCw,
  Building,
} from 'lucide-react';

interface ComplaintDetailsPageProps {
  complaintId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ComplaintDetailsPage: React.FC<ComplaintDetailsPageProps> = ({
  complaintId,
  onNavigate,
}) => {
  const { showToast } = useToast();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaintById(complaintId);
      setComplaint(res.data);
    } catch (err: any) {
      console.error('Failed to load complaint details:', err);
      showToast('error', err.message || 'Failed to fetch complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchDetails();
    }
  }, [complaintId]);

  const handleCancelComplaint = async () => {
    if (!complaint) return;
    setCancelling(true);
    try {
      await api.deleteComplaint(complaint._id);
      showToast('success', `Complaint ${complaint.complaintId} has been cancelled.`);
      setCancelModalOpen(false);
      onNavigate('my-complaints');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to cancel complaint.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
        Loading complaint ticket information...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900">Complaint Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested complaint ticket does not exist or you do not have permission to view it.
        </p>
        <button
          onClick={() => onNavigate('my-complaints')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to My Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={() => onNavigate('my-complaints')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          {complaint.status === 'Pending' && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Ticket Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        {/* Ticket Header & Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {complaint.complaintId}
              </span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                {complaint.category}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {complaint.title}
            </h1>
          </div>

          <div className="shrink-0 text-left sm:text-right space-y-1">
            <div className="text-[11px] uppercase font-semibold text-slate-400">Current Status</div>
            <StatusBadge status={complaint.status} size="md" />
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Campus Location</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{complaint.location}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Date Lodged</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{new Date(complaint.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Department Unit</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{complaint.category} Services</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Issue Description
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-100 whitespace-pre-line">
            {complaint.description}
          </p>
        </div>

        {/* Uploaded Image Evidence */}
        {complaint.image && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
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
                <span>Click to Expand</span>
              </button>
            </div>
          </div>
        )}

        {/* Admin Remarks Box (if any) */}
        {complaint.adminRemark && (
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
              <MessageSquare className="w-4 h-4 text-blue-700" />
              <span>Official Administration Remarks</span>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed pl-6 font-medium">
              "{complaint.adminRemark}"
            </p>
          </div>
        )}
      </div>

      {/* Status History Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Audit & Resolution Timeline</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {complaint.statusHistory?.length || 1} Events
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {complaint.statusHistory?.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>

              {/* Step info */}
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
                  <p className="text-slate-600 leading-relaxed pt-1">{step.remark}</p>
                )}
              </div>
            </div>
          ))}
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

      {/* Cancel Complaint Confirmation Dialog */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel Complaint Ticket"
        message={`Are you sure you want to cancel complaint ${complaint.complaintId}? This will remove the grievance from the active maintenance queue.`}
        confirmLabel="Yes, Cancel Complaint"
        isDestructive={true}
        isLoading={cancelling}
        onConfirm={handleCancelComplaint}
        onClose={() => setCancelModalOpen(false)}
      />
    </div>
  );
};
