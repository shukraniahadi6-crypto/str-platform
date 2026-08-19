import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type UserRole = 'customer' | 'courier' | 'admin';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  photo?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  isActive: boolean;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'phone'
  | 'address'
  | 'photo'
  | 'emailVerified'
  | 'phoneVerified'
  | 'identityVerified'
  | 'isActive'
>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare phone: string | null;
  declare address: string | null;
  declare photo: string | null;
  declare emailVerified: boolean;
  declare phoneVerified: boolean;
  declare identityVerified: boolean;
  declare isActive: boolean;
}

export const initUserModel = (sequelize: Sequelize): void => {
  User.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('customer', 'courier', 'admin'), allowNull: false },
      phone: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      photo: { type: DataTypes.STRING },
      emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      phoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      identityVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { sequelize, tableName: 'users' },
  );
};
