import { Response } from 'express';
import { dbService } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await dbService.complaints.getStats();
    const recentComplaints = await dbService.complaints.getAll();

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        recent: recentComplaints.slice(0, 5),
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve administrative statistics.', error: error.message });
  }
};

export const getAdminComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status, priority, search } = req.query;

    const complaints = await dbService.complaints.getAll({
      category: category as string,
      status: status as string,
      priority: priority as string,
      search: search as string,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error: any) {
    console.error('Error fetching admin complaints list:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve complaints.', error: error.message });
  }
};

export const updateComplaintStatusAndRemark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = req.user!;
    const { id } = req.params;
    const { status, adminRemark, priority } = req.body;

    const existing = await dbService.complaints.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    const updated = await dbService.complaints.update(id, {
      status,
      adminRemark,
      priority,
      changedBy: `${admin.name} (Admin)`,
    });

    res.status(200).json({
      success: true,
      message: 'Complaint status and admin remarks saved successfully.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating complaint status by admin:', error);
    res.status(500).json({ success: false, message: 'Failed to update complaint.', error: error.message });
  }
};
