import React, { useState, useRef } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import {
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  ArrowLeft,
  Send,
  HelpCircle,
} from 'lucide-react';

interface SubmitComplaintPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const CATEGORIES: ComplaintCategory[] = [
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
];

const PRIORITIES: { value: ComplaintPriority; label: string; desc: string }[] = [
  { value: 'Low', label: 'Low', desc: 'Minor cosmetic or non-critical item' },
  { value: 'Medium', label: 'Medium', desc: 'Routine repair or maintenance' },
  { value: 'High', label: 'High', desc: 'Disrupts study, lecture, or lab work' },
  { value: 'Urgent', label: 'Urgent', desc: 'Safety hazard, power trip, or active flood' },
];

export const SubmitComplaintPage: React.FC<SubmitComplaintPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Classroom');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Selected image exceeds 5MB size limit.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a concise title for your complaint.');
      return;
    }
    if (!location.trim()) {
      setError('Please specify the campus location (e.g. Block C, Room 304).');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a detailed description of the issue.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('location', location.trim());
      formData.append('priority', priority);
      formData.append('description', description.trim());

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await api.createComplaint(formData);
      showToast('success', `Complaint ${res.data.complaintId} lodged successfully!`);
      onNavigate('complaint-details', { id: res.data._id });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to lodge complaint. Please try again.');
      showToast('error', err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Page header */}
      <div>
        <button
          onClick={() => onNavigate('student-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-3 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Submit a Campus Complaint
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Fill in the grievance details. Campus maintenance will review and issue ticket updates.
            </p>
          </div>
          <span className="text-xs text-slate-500 self-start sm:self-auto bg-slate-100 px-2.5 py-1 rounded font-mono">
            Form #G-2026
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div>{error}</div>
        </div>
      )}

      {/* Complaint filing form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="complaint-title" className="block text-xs font-semibold text-slate-800 mb-1">
            Complaint Subject / Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="complaint-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Projector power failure in Science Block B Room 204"
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            State the exact malfunction or issue in 5–15 words.
          </p>
        </div>

        {/* Category and Location (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="complaint-category" className="block text-xs font-semibold text-slate-800 mb-1">
              Department / Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="complaint-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="complaint-location" className="block text-xs font-semibold text-slate-800 mb-1">
              Campus Location <span className="text-rose-500">*</span>
            </label>
            <input
              id="complaint-location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hostel C - 2nd Floor Corridor, Rm 212"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-2">
            Estimated Priority / Impact <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIORITIES.map((p) => {
              const isSelected = priority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      {p.label}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.value === 'Urgent'
                          ? 'bg-rose-500'
                          : p.value === 'High'
                          ? 'bg-orange-500'
                          : p.value === 'Medium'
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="complaint-description" className="block text-xs font-semibold text-slate-800 mb-1">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="complaint-description"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, when it started, and any symptoms or specific equipment names..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 leading-relaxed"
          />
        </div>

        {/* Image Evidence Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Photo Evidence (Optional, Recommended)
          </label>

          {previewUrl ? (
            <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50 max-w-sm">
              <img
                src={previewUrl}
                alt="Selected evidence preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-xs text-slate-600 truncate max-w-[200px]">
                  {selectedFile?.name}
                </span>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-600">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-700">
                Click to browse or drag and drop image evidence
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, WebP up to 5MB (broken equipment, leaks, error screens)
              </p>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Tickets are logged under your registered Student ID</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('student-dashboard')}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-complaint-btn"
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
