import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type JobStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

export interface JobAttributes {
  id: string;
  customerId: string;
  courierId?: string | null;
  title: string;
  description: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt?: Date | null;
  status: JobStatus;
  acceptedBidId?: string | null;
}

export type JobCreationAttributes = Optional<JobAttributes, 'id' | 'courierId' | 'scheduledAt' | 'status' | 'acceptedBidId'>;

export class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  declare id: string;
  declare customerId: string;
  declare courierId: string | null;
  declare title: string;
  declare description: string;
  declare pickupAddress: string;
  declare dropoffAddress: string;
  declare scheduledAt: Date | null;
  declare status: JobStatus;
  declare acceptedBidId: string | null;
}

export const initJobModel = (sequelize: Sequelize): void => {
  Job.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      customerId: { type: DataTypes.UUID, allowNull: false },
      courierId: { type: DataTypes.UUID },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      pickupAddress: { type: DataTypes.STRING, allowNull: false },
      dropoffAddress: { type: DataTypes.STRING, allowNull: false },
      scheduledAt: { type: DataTypes.DATE },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'in-progress', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
      acceptedBidId: { type: DataTypes.UUID },
    },
    { sequelize, tableName: 'jobs' },
  );
};
