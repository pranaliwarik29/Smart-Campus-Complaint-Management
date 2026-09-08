import { Router } from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(protect);

router.get('/', getComplaints);
router.post('/', upload.single('image'), createComplaint);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

export default router;
