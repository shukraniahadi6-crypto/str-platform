import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../../core/database';
import { SDSCase } from '../../../models/SDSCase';
import { NotFoundError } from '../../../utils/errors';

const caseRepo = () => AppDataSource.getRepository(SDSCase);

export async function getCases(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cases = await caseRepo().find({
      where: { human_review_status: 'PENDING' },
      relations: ['job'],
      order: { created_at: 'ASC' },
    });
    res.json(cases);
  } catch (err) { next(err); }
}

export async function reviewCase(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sdsCase = await caseRepo().findOne({ where: { id: req.params.id } });
    if (!sdsCase) throw new NotFoundError('SDSCase');
    const { decision, notes } = req.body;
    sdsCase.human_review_status = decision;
    sdsCase.review_notes = notes;
    sdsCase.reviewer_id = req.user!.id;
    if (decision === 'RESOLVED') sdsCase.resolved_at = new Date();
    await caseRepo().save(sdsCase);
    res.json(sdsCase);
  } catch (err) { next(err); }
}
