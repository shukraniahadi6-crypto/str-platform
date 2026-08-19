import { Router } from 'express';
import multer from 'multer';
import { estimate, createJob, getJob, listJobs, cancelJob, uploadPhotos } from './controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validation';
import { createJobSchema, estimateSchema } from '../../../schemas/job';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authenticate);
router.post('/estimate', upload.single('image'), estimate);
router.post('/', validate(createJobSchema), createJob);
router.get('/', listJobs);
router.get('/:id', getJob);
router.put('/:id/cancel', cancelJob);
router.post('/:id/photos', upload.array('photos', 10), uploadPhotos);

export default router;
