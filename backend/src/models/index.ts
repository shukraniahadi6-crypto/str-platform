import { Sequelize } from 'sequelize';
import { Courier, initCourierModel } from './Courier';
import { Dispute, initDisputeModel } from './Dispute';
import { Job, initJobModel } from './Job';
import { Offer, initOfferModel } from './Offer';
import { Payment, initPaymentModel } from './Payment';
import { Transaction, initTransactionModel } from './Transaction';
import { User, initUserModel } from './User';

let initialized = false;

export const initializeModels = (sequelize: Sequelize): void => {
  if (initialized) return;

  initUserModel(sequelize);
  initCourierModel(sequelize);
  initJobModel(sequelize);
  initOfferModel(sequelize);
  initPaymentModel(sequelize);
  initTransactionModel(sequelize);
  initDisputeModel(sequelize);

  User.hasOne(Courier, { foreignKey: 'userId' });
  Courier.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Job, { foreignKey: 'customerId' });
  Job.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

  User.hasMany(Job, { foreignKey: 'courierId' });
  Job.belongsTo(User, { foreignKey: 'courierId', as: 'courier' });

  Job.hasMany(Offer, { foreignKey: 'jobId' });
  Offer.belongsTo(Job, { foreignKey: 'jobId' });

  initialized = true;
};

export { User, Courier, Job, Offer, Payment, Transaction, Dispute };
