import { AppDataSource } from '../core/database';
import { Course, CourierCompletion } from '../models/Course';
import { Badge, CourierBadge } from '../models/Badge';
import { NotFoundError, AppError } from '../utils/errors';

const courseRepo = () => AppDataSource.getRepository(Course);
const completionRepo = () => AppDataSource.getRepository(CourierCompletion);
const badgeRepo = () => AppDataSource.getRepository(Badge);
const courierBadgeRepo = () => AppDataSource.getRepository(CourierBadge);

export async function getCourses(): Promise<Course[]> {
  return courseRepo().find({ where: { is_active: true } });
}

export async function completeCourse(
  courierId: string,
  courseId: string,
  answers: Record<string, string>
): Promise<{ completion: CourierCompletion; badges: CourierBadge[] }> {
  const course = await courseRepo().findOne({ where: { id: courseId } });
  if (!course) throw new NotFoundError('Course');

  const questions = (course.quiz_questions_json as any)?.questions || [];
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct_answer) correct++;
  }
  const score = questions.length > 0 ? (correct / questions.length) * 100 : 100;
  const passed = score >= Number(course.pass_threshold);

  const completion = await completionRepo().save(completionRepo().create({
    courier_id: courierId,
    course_id: courseId,
    score,
    passed,
    completion_date: new Date(),
  }));

  const earnedBadges: CourierBadge[] = [];
  if (passed) {
    const badges = await badgeRepo().find({ where: { requirement_course_id: courseId } });
    for (const badge of badges) {
      const existing = await courierBadgeRepo().findOne({
        where: { courier_id: courierId, badge_id: badge.id },
      });
      if (!existing) {
        const cb = await courierBadgeRepo().save(courierBadgeRepo().create({
          courier_id: courierId,
          badge_id: badge.id,
        }));
        earnedBadges.push(cb);
      }
    }
  }

  return { completion, badges: earnedBadges };
}

export async function getCourierBadges(courierId: string): Promise<CourierBadge[]> {
  return courierBadgeRepo().find({
    where: { courier_id: courierId },
    relations: ['badge'],
  });
}
