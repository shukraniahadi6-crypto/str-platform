import { Job, Payment, User } from '../models';

export const getAdminAnalytics = async (): Promise<{
  users: { total: number; active: number };
  jobs: { total: number; completed: number };
  revenue: { gross: number };
}> => {
  const [totalUsers, activeUsers, totalJobs, completedJobs, payments] = await Promise.all([
    User.count(),
    User.count({ where: { isActive: true } }),
    Job.count(),
    Job.count({ where: { status: 'completed' } }),
    Payment.sum('amount'),
  ]);

  return {
    users: { total: totalUsers, active: activeUsers },
    jobs: { total: totalJobs, completed: completedJobs },
    revenue: { gross: Number(payments ?? 0) },
  };
};
