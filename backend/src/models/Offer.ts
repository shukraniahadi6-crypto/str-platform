import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface OfferAttributes {
  id: string;
  jobId: string;
  courierId: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export type OfferCreationAttributes = Optional<OfferAttributes, 'id' | 'status'>;

export class Offer extends Model<OfferAttributes, OfferCreationAttributes> implements OfferAttributes {
  declare id: string;
  declare jobId: string;
  declare courierId: string;
  declare price: number;
  declare status: 'pending' | 'accepted' | 'rejected';
}

export const initOfferModel = (sequelize: Sequelize): void => {
  Offer.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      jobId: { type: DataTypes.UUID, allowNull: false },
      courierId: { type: DataTypes.UUID, allowNull: false },
      price: { type: DataTypes.FLOAT, allowNull: false },
      status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },
    },
    { sequelize, tableName: 'offers' },
  );
};
