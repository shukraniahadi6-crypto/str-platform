import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { initializeModels } from '../models';

const isSqlite =
  env.DATABASE_URL === ':memory:' ||
  env.DATABASE_URL.startsWith('sqlite://') ||
  env.DATABASE_URL.startsWith('sqlite::');

const sqliteStorage =
  env.DATABASE_URL === ':memory:'
    ? ':memory:'
    : env.DATABASE_URL.startsWith('sqlite://')
      ? env.DATABASE_URL.slice('sqlite://'.length)
      : ':memory:';

export const sequelize = isSqlite
  ? new Sequelize({ dialect: 'sqlite', storage: sqliteStorage, logging: false })
  : new Sequelize(env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : undefined,
      },
    });

export const initializeDatabase = async (): Promise<void> => {
  initializeModels(sequelize);
  await sequelize.authenticate();
  if (env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: false });
  }
};
