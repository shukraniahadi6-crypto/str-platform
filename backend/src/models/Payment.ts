import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PaymentAttributes {
  id: string;
  jobId: string;
  customerId: string;
  courierId: string;
  amount: number;
  currency: string;
  status: 'charged' | 'refunded' | 'failed';
  stripePaymentIntentId?: string | null;
}

export type PaymentCreationAttributes = Optional<PaymentAttributes, 'id' | 'currency' | 'status' | 'stripePaymentIntentId'>;

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: string;
  declare jobId: string;
  declare customerId: string;
  declare courierId: string;
  declare amount: number;
  declare currency: string;
  declare status: 'charged' | 'refunded' | 'failed';
  declare stripePaymentIntentId: string | null;
}

export const initPaymentModel = (sequelize: Sequelize): void => {
  Payment.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      jobId: { type: DataTypes.UUID, allowNull: false },
      customerId: { type: DataTypes.UUID, allowNull: false },
      courierId: { type: DataTypes.UUID, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      currency: { type: DataTypes.STRING, defaultValue: 'usd' },
      status: { type: DataTypes.ENUM('charged', 'refunded', 'failed'), defaultValue: 'charged' },
      stripePaymentIntentId: { type: DataTypes.STRING },
    },
    { sequelize, tableName: 'payments' },
  );
};
