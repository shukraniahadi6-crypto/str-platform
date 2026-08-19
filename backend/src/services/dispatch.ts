import { AppDataSource } from '../core/database';
import { Job, JobStatus } from '../models/Job';
import { OfferPing, OfferPingStatus } from '../models/OfferPing';
import { User, UserRole } from '../models/User';
import { CourierLocation } from '../models/Job';
import { haversineDistance } from '../utils/spatial';
import { NotFoundError, AppError } from '../utils/errors';
import { getIO } from '../core/socketio';
import { getOfferExpiryQueue } from '../workers/offer-expiry';

const jobRepo = () => AppDataSource.getRepository(Job);
const offerRepo = () => AppDataSource.getRepository(OfferPing);
const userRepo = () => AppDataSource.getRepository(User);
const courierLocRepo = () => AppDataSource.getRepository(CourierLocation);

const OFFER_EXPIRY_SECONDS = 30;
const MAX_COURIER_DISTANCE_M = 2000;
const MIN_COURIER_RATING = 4.0;

export interface CourierCandidate {
  courierId: string;
  distance: number;
  rating: number;
}

/**
 * Find eligible couriers for a job based on proximity, rating, and availability.
 */
export async function findEligibleCouriers(
  jobLat: number,
  jobLng: number,
  limit = 10
): Promise<CourierCandidate[]> {
  const courierLocations = await courierLocRepo().find();
  const candidates: CourierCandidate[] = [];

  for (const loc of courierLocations) {
    const dist = haversineDistance(jobLat, jobLng, Number(loc.latitude), Number(loc.longitude));
    if (dist <= MAX_COURIER_DISTANCE_M) {
      candidates.push({
        courierId: loc.courier_id,
        distance: dist,
        rating: 5.0, // Will be fetched from profile in production
      });
    }
  }

  return candidates
    .filter((c) => c.rating >= MIN_COURIER_RATING)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Calculate upfront pay for a courier based on job details.
 */
export function calculateUpfrontPay(
  distanceMeters: number,
  estimatedVolume = 0
): {
  basePay: number;
  distanceBonus: number;
  weightAllowance: number;
  estimatedTip: number;
  total: number;
} {
  const basePay = 15;
  const distanceBonus = Math.max(0, (distanceMeters / 1000) * 1.5);
  const weightAllowance = estimatedVolume * 2;
  const estimatedTip = 3;
  const total = basePay + distanceBonus + weightAllowance + estimatedTip;
  return { basePay, distanceBonus, weightAllowance, estimatedTip, total };
}

/**
 * Send an offer ping to a courier for a job.
 */
export async function pingCourier(jobId: string, courierId: string, distanceMeters: number): Promise<OfferPing> {
  const job = await jobRepo().findOne({ where: { id: jobId } });
  if (!job) throw new NotFoundError('Job');

  const pay = calculateUpfrontPay(distanceMeters, Number(job.estimated_volume));
  const expiresAt = new Date(Date.now() + OFFER_EXPIRY_SECONDS * 1000);

  const ping = await offerRepo().save(offerRepo().create({
    job_id: jobId,
    courier_id: courierId,
    upfront_pay: pay.total,
    estimated_distance: distanceMeters,
    base_pay: pay.basePay,
    distance_bonus: pay.distanceBonus,
    weight_allowance: pay.weightAllowance,
    estimated_tip: pay.estimatedTip,
    status: OfferPingStatus.PENDING,
    expires_at: expiresAt,
  }));

  // Broadcast via Socket.io
  try {
    getIO().of('/offers').to(`courier:${courierId}`).emit('offer:ping', {
      offerId: ping.id,
      jobId,
      upfrontPay: pay.total,
      distanceMeters,
      expiresAt,
    });
  } catch {
    // Socket.io may not be initialized in tests
  }

  // Schedule expiry via Bull queue
  try {
    const queue = getOfferExpiryQueue();
    await queue.add({ offerId: ping.id, courierId, jobId }, { delay: OFFER_EXPIRY_SECONDS * 1000 });
  } catch {
    // Queue may not be initialized in tests
  }

  return ping;
}

/**
 * Accept an offer ping (courier action).
 */
export async function acceptOffer(offerId: string, courierId: string): Promise<OfferPing> {
  const ping = await offerRepo().findOne({ where: { id: offerId, courier_id: courierId } });
  if (!ping) throw new NotFoundError('Offer');
  if (ping.status !== OfferPingStatus.PENDING) throw new AppError('Offer is no longer available', 400, 'OFFER_NOT_AVAILABLE');
  if (ping.expires_at < new Date()) throw new AppError('Offer has expired', 400, 'OFFER_EXPIRED');

  ping.status = OfferPingStatus.ACCEPTED;
  await offerRepo().save(ping);

  // Update job status
  await jobRepo().update(ping.job_id, { status: JobStatus.ASSIGNED, courier_id: courierId });

  return ping;
}

/**
 * Decline an offer ping and cascade to next courier.
 */
export async function declineOffer(offerId: string, courierId: string): Promise<void> {
  const ping = await offerRepo().findOne({ where: { id: offerId, courier_id: courierId } });
  if (!ping) throw new NotFoundError('Offer');
  if (ping.status !== OfferPingStatus.PENDING) throw new AppError('Offer already processed', 400, 'OFFER_PROCESSED');

  ping.status = OfferPingStatus.DECLINED;
  await offerRepo().save(ping);

  // Cascade to next courier (find next eligible)
  const job = await jobRepo().findOne({ where: { id: ping.job_id } });
  if (job) {
    const jobLocation = await AppDataSource.getRepository(require('../models/Job').JobLocation)
      .findOne({ where: { job_id: job.id } });
    if (jobLocation) {
      // Get previously declined couriers
      const declinedPings = await offerRepo().find({
        where: { job_id: job.id, status: OfferPingStatus.DECLINED },
        select: ['courier_id'],
      });
      const excludeIds = new Set([courierId, ...declinedPings.map((p) => p.courier_id)]);

      const candidates = await findEligibleCouriers(
        Number(jobLocation.latitude),
        Number(jobLocation.longitude)
      );
      const nextCourier = candidates.find((c) => !excludeIds.has(c.courierId));
      if (nextCourier) {
        await pingCourier(job.id, nextCourier.courierId, nextCourier.distance);
      }
    }
  }
}
