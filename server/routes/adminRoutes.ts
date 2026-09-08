import { Router } from 'express';
import {
  getAdminStats,
  getAdminComplaints,
  updateComplaintStatusAndRemark,
} from '../controllers/adminController';
import { protect, requireRole } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/complaints', getAdminComplaints);
router.put('/complaints/:id', updateComplaintStatusAndRemark);

export default router;
