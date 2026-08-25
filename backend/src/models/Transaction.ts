import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TransactionAttributes {
  id: string;
  userId: string;
  referenceId: string;
  type: 'debit' | 'credit';
  category: 'charge' | 'refund' | 'payout' | 'commission';
  amount: number;
}

export type TransactionCreationAttributes = Optional<TransactionAttributes, 'id'>;

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  declare id: string;
  declare userId: string;
  declare referenceId: string;
  declare type: 'debit' | 'credit';
  declare category: 'charge' | 'refund' | 'payout' | 'commission';
  declare amount: number;
}

export const initTransactionModel = (sequelize: Sequelize): void => {
  Transaction.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      referenceId: { type: DataTypes.UUID, allowNull: false },
      type: { type: DataTypes.ENUM('debit', 'credit'), allowNull: false },
      category: { type: DataTypes.ENUM('charge', 'refund', 'payout', 'commission'), allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
    },
    { sequelize, tableName: 'transactions' },
  );
};
