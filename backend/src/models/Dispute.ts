import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface DisputeAttributes {
  id: string;
  jobId: string;
  openedByUserId: string;
  reason: string;
  evidenceUrl?: string | null;
  status: 'open' | 'resolved' | 'rejected';
  resolutionNotes?: string | null;
}

export type DisputeCreationAttributes = Optional<DisputeAttributes, 'id' | 'evidenceUrl' | 'status' | 'resolutionNotes'>;

export class Dispute extends Model<DisputeAttributes, DisputeCreationAttributes> implements DisputeAttributes {
  declare id: string;
  declare jobId: string;
  declare openedByUserId: string;
  declare reason: string;
  declare evidenceUrl: string | null;
  declare status: 'open' | 'resolved' | 'rejected';
  declare resolutionNotes: string | null;
}

export const initDisputeModel = (sequelize: Sequelize): void => {
  Dispute.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      jobId: { type: DataTypes.UUID, allowNull: false },
      openedByUserId: { type: DataTypes.UUID, allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: false },
      evidenceUrl: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM('open', 'resolved', 'rejected'), defaultValue: 'open' },
      resolutionNotes: { type: DataTypes.TEXT },
    },
    { sequelize, tableName: 'disputes' },
  );
};
