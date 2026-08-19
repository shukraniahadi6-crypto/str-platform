import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface CourierAttributes {
  id: string;
  userId: string;
  serviceArea: string;
  availability: boolean;
  rating: number;
  completionRate: number;
  reliabilityScore: number;
  isSuspended: boolean;
}

export type CourierCreationAttributes = Optional<
  CourierAttributes,
  'id' | 'serviceArea' | 'availability' | 'rating' | 'completionRate' | 'reliabilityScore' | 'isSuspended'
>;

export class Courier extends Model<CourierAttributes, CourierCreationAttributes> implements CourierAttributes {
  declare id: string;
  declare userId: string;
  declare serviceArea: string;
  declare availability: boolean;
  declare rating: number;
  declare completionRate: number;
  declare reliabilityScore: number;
  declare isSuspended: boolean;
}

export const initCourierModel = (sequelize: Sequelize): void => {
  Courier.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false, unique: true },
      serviceArea: { type: DataTypes.STRING, defaultValue: 'default' },
      availability: { type: DataTypes.BOOLEAN, defaultValue: true },
      rating: { type: DataTypes.FLOAT, defaultValue: 5 },
      completionRate: { type: DataTypes.FLOAT, defaultValue: 100 },
      reliabilityScore: { type: DataTypes.FLOAT, defaultValue: 100 },
      isSuspended: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, tableName: 'couriers' },
  );
};
