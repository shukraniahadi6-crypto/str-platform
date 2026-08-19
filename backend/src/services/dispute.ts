import { Dispute } from '../models/Dispute';

export const createDispute = async (input: {
  jobId: string;
  openedByUserId: string;
  reason: string;
  evidenceUrl?: string;
}): Promise<Dispute> => {
  return Dispute.create(input);
};

export const listDisputes = async (): Promise<Dispute[]> => Dispute.findAll({ order: [['createdAt', 'DESC']] });

export const resolveDispute = async (id: string, status: 'resolved' | 'rejected', resolutionNotes: string): Promise<Dispute | null> => {
  const dispute = await Dispute.findByPk(id);
  if (!dispute) return null;
  dispute.status = status;
  dispute.resolutionNotes = resolutionNotes;
  await dispute.save();
  return dispute;
};
