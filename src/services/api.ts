import { User, Complaint, AdminStats } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('campuscare_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Auth
  async login(payload: { email: string; password: string; expectedRole?: string }): Promise<{
    token: string;
    user: User;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async register(payload: {
    name: string;
    email: string;
    studentId: string;
    password: string;
    confirmPassword: string;
    role?: 'student' | 'admin';
  }): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Complaints (Student & Shared)
  async getComplaints(params?: {
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<{ data: Complaint[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/complaints${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getComplaintById(id: string): Promise<{ data: Complaint }> {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async createComplaint(formData: FormData): Promise<{ data: Complaint; message: string }> {
    const headers = getAuthHeader(); // Note: Don't set Content-Type for FormData so browser sets boundary
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  async updateComplaint(
    id: string,
    updates: { priority?: string; status?: string }
  ): Promise<{ data: Complaint; message: string }> {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async deleteComplaint(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Admin APIs
  async getAdminStats(): Promise<{ data: AdminStats }> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAdminComplaints(params?: {
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<{ data: Complaint[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/admin/complaints${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateAdminComplaint(
    id: string,
    payload: { status?: string; adminRemark?: string; priority?: string }
  ): Promise<{ data: Complaint; message: string }> {
    const res = await fetch(`${API_BASE}/admin/complaints/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
