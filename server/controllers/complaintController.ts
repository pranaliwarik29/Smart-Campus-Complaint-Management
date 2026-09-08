import { Response } from 'express';
import { dbService } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { category, status, priority, search } = req.query;

    const complaints = await dbService.complaints.getAll({
      userId: user.role === 'admin' ? undefined : user._id,
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
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve complaints.', error: error.message });
  }
};

export const getComplaintById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const complaint = await dbService.complaints.findById(id);
    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint record not found.' });
      return;
    }

    // Role check: Student can only view their own complaint
    if (user.role !== 'admin' && complaint.user !== user._id && complaint.studentId !== user.studentId) {
      res.status(403).json({ success: false, message: 'Unauthorized. You can only view your own complaints.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error: any) {
    console.error('Error fetching complaint details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve complaint record.', error: error.message });
  }
};

export const createComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { title, category, description, location, priority } = req.body;

    if (!title || !category || !description || !location) {
      res.status(400).json({
        success: false,
        message: 'Title, Category, Location, and Description are required fields.',
      });
      return;
    }

    // Image handling: Multer file upload or optional direct image URL
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const newComplaint = await dbService.complaints.create({
      title,
      category,
      description,
      location,
      priority: (priority as any) || 'Medium',
      image: imageUrl,
      user: user._id,
      studentId: user.studentId,
      studentName: user.name,
      studentEmail: user.email,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      data: newComplaint,
    });
  } catch (error: any) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: 'Failed to submit complaint.', error: error.message });
  }
};

export const updateComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const existing = await dbService.complaints.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    if (user.role !== 'admin' && existing.user !== user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to modify this complaint.' });
      return;
    }

    // If student, can only modify while still Pending
    if (user.role !== 'admin' && existing.status !== 'Pending') {
      res.status(400).json({
        success: false,
        message: 'This complaint is already under review and cannot be edited by the student.',
      });
      return;
    }

    const { priority } = req.body;
    const updated = await dbService.complaints.update(id, {
      priority,
      changedBy: `${user.name} (${user.role})`,
    });

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ success: false, message: 'Failed to update complaint.', error: error.message });
  }
};

export const deleteComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const existing = await dbService.complaints.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    if (user.role !== 'admin' && existing.user !== user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to delete this complaint.' });
      return;
    }

    if (user.role !== 'admin' && existing.status !== 'Pending') {
      res.status(400).json({
        success: false,
        message: 'Only Pending complaints can be cancelled by the student.',
      });
      return;
    }

    const success = await dbService.complaints.delete(id);
    if (success) {
      res.status(200).json({ success: true, message: 'Complaint record removed successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to delete complaint record.' });
    }
  } catch (error: any) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ success: false, message: 'Server error deleting complaint.', error: error.message });
  }
};
