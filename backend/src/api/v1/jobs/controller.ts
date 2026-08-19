import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../../core/database';
import { Job, JobStatus, JobPhoto, PhotoType, JobLocation } from '../../../models/Job';
import { SDSCase } from '../../../models/SDSCase';
import { NotFoundError, ForbiddenError } from '../../../utils/errors';
import { estimateFromImage } from '../../../services/vision-estimator';
import { geocodeAddress } from '../../../core/google-maps';
import { findEligibleCouriers, pingCourier } from '../../../services/dispatch';
import { findOrCreateNeighborhood } from '../../../services/batching';
import { UserRole } from '../../../models/User';

const jobRepo = () => AppDataSource.getRepository(Job);
const photoRepo = () => AppDataSource.getRepository(JobPhoto);
const locRepo = () => AppDataSource.getRepository(JobLocation);

export async function estimate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { image } = req.body;
    if (!image && !req.file) {
      res.status(400).json({ code: 'NO_IMAGE', message: 'Image required' });
      return;
    }
    const imageBase64 = image || req.file?.buffer.toString('base64') || '';
    const result = await estimateFromImage(imageBase64);
    res.json(result);
  } catch (err) { next(err); }
}

export async function createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { address, items_json, estimated_volume, special_instructions, scheduled_at } = req.body;

    // Geocode address
    const { lat, lng } = await geocodeAddress(address);

    const job = await jobRepo().save(jobRepo().create({
      vendor_id: req.user!.id,
      address,
      items_json,
      estimated_volume,
      special_instructions,
      scheduled_at,
      status: JobStatus.PENDING,
    }));

    // Store job location
    await locRepo().save(locRepo().create({ job_id: job.id, latitude: lat, longitude: lng }));

    // Find neighborhood group for batching
    await findOrCreateNeighborhood(lat, lng);

    // Dispatch to nearby couriers
    const candidates = await findEligibleCouriers(lat, lng, 1);
    if (candidates.length > 0) {
      await pingCourier(job.id, candidates[0].courierId, candidates[0].distance);
    }

    res.status(201).json(job);
  } catch (err) { next(err); }
}

export async function getJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const job = await jobRepo().findOne({
      where: { id: req.params.id },
      relations: ['photos'],
    });
    if (!job) throw new NotFoundError('Job');

    // Vendor can only view own jobs
    if (req.user!.role === UserRole.VENDOR && job.vendor_id !== req.user!.id) {
      throw new ForbiddenError();
    }
    res.json(job);
  } catch (err) { next(err); }
}

export async function listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const where: Partial<Job> = {};
    if (req.user!.role === UserRole.VENDOR) {
      where.vendor_id = req.user!.id;
    } else if (req.user!.role === UserRole.COURIER) {
      where.status = JobStatus.PENDING;
    }
    const jobs = await jobRepo().find({ where, order: { created_at: 'DESC' } });
    res.json(jobs);
  } catch (err) { next(err); }
}

export async function cancelJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const job = await jobRepo().findOne({ where: { id: req.params.id } });
    if (!job) throw new NotFoundError('Job');
    if (job.vendor_id !== req.user!.id) throw new ForbiddenError();
    job.status = JobStatus.CANCELLED;
    await jobRepo().save(job);
    res.json(job);
  } catch (err) { next(err); }
}

export async function uploadPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const job = await jobRepo().findOne({ where: { id: req.params.id } });
    if (!job) throw new NotFoundError('Job');

    const photoType = req.query.type as PhotoType || PhotoType.BEFORE;
    const files = req.files as Express.Multer.File[];

    const photos = await Promise.all(
      files.map((file) =>
        photoRepo().save(photoRepo().create({
          job_id: job.id,
          url: `https://s3.amazonaws.com/${process.env.AWS_S3_BUCKET}/${file.filename}`,
          photo_type: photoType,
        }))
      )
    );

    res.status(201).json(photos);
  } catch (err) { next(err); }
}
