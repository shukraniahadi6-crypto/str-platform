import { AppDataSource } from '../core/database';
import { Job, JobStatus } from '../models/Job';
import { Batch, NeighborhoodGroup } from '../models/Batch';
import { haversineDistance } from '../utils/spatial';
import { getIO } from '../core/socketio';
import { getOptimalRoute } from '../core/google-maps';

const jobRepo = () => AppDataSource.getRepository(Job);
const batchRepo = () => AppDataSource.getRepository(Batch);
const neighborhoodRepo = () => AppDataSource.getRepository(NeighborhoodGroup);

const BATCH_RADIUS_M = 500;
const DEFAULT_BATCH_DISCOUNT = 25;

/**
 * Find or create a neighborhood group for the given coordinates.
 */
export async function findOrCreateNeighborhood(lat: number, lng: number): Promise<NeighborhoodGroup> {
  const groups = await neighborhoodRepo().find();
  for (const group of groups) {
    if (haversineDistance(lat, lng, Number(group.center_latitude), Number(group.center_longitude)) <= BATCH_RADIUS_M) {
      return group;
    }
  }
  // Create new group
  return neighborhoodRepo().save(neighborhoodRepo().create({
    name: `Zone-${lat.toFixed(3)}-${lng.toFixed(3)}`,
    center_latitude: lat,
    center_longitude: lng,
    radius_meters: BATCH_RADIUS_M,
    discount_rate: DEFAULT_BATCH_DISCOUNT,
    alert_radius_m: BATCH_RADIUS_M,
  }));
}

/**
 * Check for nearby pending jobs and bundle them into a batch.
 */
export async function tryCreateBatch(
  jobId: string,
  courierId: string,
  jobLat: number,
  jobLng: number
): Promise<Batch | null> {
  const pendingJobs = await jobRepo().find({ where: { status: JobStatus.PENDING } });

  // Find nearby jobs
  const nearbyJobIds: string[] = [jobId];
  for (const j of pendingJobs) {
    if (j.id === jobId) continue;
    const jLocRepo = AppDataSource.getRepository(require('../models/Job').JobLocation);
    const loc = await jLocRepo.findOne({ where: { job_id: j.id } });
    if (loc) {
      const dist = haversineDistance(jobLat, jobLng, Number(loc.latitude), Number(loc.longitude));
      if (dist <= BATCH_RADIUS_M) nearbyJobIds.push(j.id);
    }
  }

  if (nearbyJobIds.length < 2) return null;

  // Create batch
  const batch = await batchRepo().save(batchRepo().create({
    courier_id: courierId,
    job_ids: nearbyJobIds,
    batch_discount_pct: DEFAULT_BATCH_DISCOUNT,
  }));

  // Update all jobs to BATCHED
  await jobRepo().update(nearbyJobIds, { status: JobStatus.BATCHED, batch_id: batch.id });

  // Notify via socket
  try {
    getIO().of('/batch-alerts').emit('batch:created', {
      batchId: batch.id,
      jobIds: nearbyJobIds,
      discountPct: DEFAULT_BATCH_DISCOUNT,
      message: `Neighbor's pickup just wrapped! Join the next run for ${DEFAULT_BATCH_DISCOUNT}% off!`,
    });
  } catch {
    // Socket.io may not be initialized in tests
  }

  return batch;
}

/**
 * Optimize route for a batch using Google Maps.
 */
export async function optimizeBatchRoute(batchId: string): Promise<Batch> {
  const batch = await batchRepo().findOne({ where: { id: batchId } });
  if (!batch) throw new Error('Batch not found');

  const jobLocRepo = AppDataSource.getRepository(require('../models/Job').JobLocation);
  const locations: { lat: number; lng: number }[] = [];

  for (const jobId of batch.job_ids) {
    const loc = await jobLocRepo.findOne({ where: { job_id: jobId } });
    if (loc) locations.push({ lat: Number(loc.latitude), lng: Number(loc.longitude) });
  }

  if (locations.length < 2) return batch;

  const [origin, ...rest] = locations;
  const destination = rest[rest.length - 1];
  const waypoints = rest.slice(0, -1);

  const route = await getOptimalRoute(origin, waypoints, destination);
  batch.route_sequence = route as any;
  return batchRepo().save(batch);
}
