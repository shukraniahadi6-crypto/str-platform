import { DataSource } from 'typeorm';
import { config } from './config';
import { User } from '../models/User';
import { UserProfile } from '../models/User';
import { DriverVerification } from '../models/User';
import { DeviceToken } from '../models/User';
import { Job } from '../models/Job';
import { JobPhoto } from '../models/Job';
import { JobLocation } from '../models/Job';
import { CourierLocation } from '../models/Job';
import { TransferStation } from '../models/Job';
import { DonationPartner } from '../models/Job';
import { OfferPing } from '../models/OfferPing';
import { Batch } from '../models/Batch';
import { NeighborhoodGroup } from '../models/Batch';
import { UpcyclableItem } from '../models/GreenImpact';
import { GreenImpactMetric } from '../models/GreenImpact';
import { GreenImpactReceipt } from '../models/GreenImpact';
import { LedgerEntry } from '../models/Ledger';
import { VendorAccount } from '../models/Ledger';
import { CourierAccount } from '../models/Ledger';
import { Payment } from '../models/Ledger';
import { Payout } from '../models/Ledger';
import { SDSCase } from '../models/SDSCase';
import { Course } from '../models/Course';
import { CourierCompletion } from '../models/Course';
import { Badge } from '../models/Badge';
import { CourierBadge } from '../models/Badge';
import { Dispute } from '../models/Dispute';
import { NotificationLog } from '../models/Notification';
import { PushNotificationQueue } from '../models/Notification';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  synchronize: config.env === 'development',
  logging: config.env === 'development',
  entities: [
    User, UserProfile, DriverVerification, DeviceToken,
    Job, JobPhoto, JobLocation, CourierLocation, TransferStation, DonationPartner,
    OfferPing, Batch, NeighborhoodGroup,
    UpcyclableItem, GreenImpactMetric, GreenImpactReceipt,
    LedgerEntry, VendorAccount, CourierAccount, Payment, Payout,
    SDSCase, Course, CourierCompletion, Badge, CourierBadge,
    Dispute, NotificationLog, PushNotificationQueue,
  ],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],
});

export async function connectDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
