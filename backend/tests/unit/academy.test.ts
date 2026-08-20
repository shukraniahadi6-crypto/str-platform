// Academy service: course progression and badge unlocks.
interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: number;
  totalLessons: number;
  quizScore?: number; // 0-100
}

interface Badge {
  id: string;
  name: string;
  requiredCourseId: string;
  minQuizScore: number;
}

export function getCourseCompletionPct(progress: CourseProgress): number {
  if (progress.totalLessons === 0) return 0;
  return Math.round((progress.completedLessons / progress.totalLessons) * 100);
}

export function isCourseComplete(progress: CourseProgress): boolean {
  return progress.completedLessons >= progress.totalLessons;
}

export function canEarnBadge(progress: CourseProgress, badge: Badge): boolean {
  return (
    progress.courseId === badge.requiredCourseId &&
    isCourseComplete(progress) &&
    (progress.quizScore ?? 0) >= badge.minQuizScore
  );
}

describe('Academy Service — Unit Tests', () => {
  const progress: CourseProgress = {
    courseId: 'course-sds-101',
    userId: 'user-1',
    completedLessons: 8,
    totalLessons: 10,
    quizScore: 85,
  };

  const badge: Badge = {
    id: 'badge-sds',
    name: 'SDS Safety Certified',
    requiredCourseId: 'course-sds-101',
    minQuizScore: 80,
  };

  describe('getCourseCompletionPct', () => {
    it('should calculate completion percentage', () => {
      expect(getCourseCompletionPct(progress)).toBe(80);
    });

    it('should return 0 for no lessons', () => {
      expect(getCourseCompletionPct({ ...progress, totalLessons: 0 })).toBe(0);
    });

    it('should return 100 when all lessons done', () => {
      expect(getCourseCompletionPct({ ...progress, completedLessons: 10 })).toBe(100);
    });
  });

  describe('isCourseComplete', () => {
    it('should return false when not all lessons done', () => {
      expect(isCourseComplete(progress)).toBe(false);
    });

    it('should return true when all lessons completed', () => {
      expect(isCourseComplete({ ...progress, completedLessons: 10 })).toBe(true);
    });
  });

  describe('canEarnBadge', () => {
    const completedProgress: CourseProgress = { ...progress, completedLessons: 10 };

    it('should return true when all conditions met', () => {
      expect(canEarnBadge(completedProgress, badge)).toBe(true);
    });

    it('should return false if course not complete', () => {
      expect(canEarnBadge(progress, badge)).toBe(false);
    });

    it('should return false if quiz score is too low', () => {
      const lowScore = { ...completedProgress, quizScore: 60 };
      expect(canEarnBadge(lowScore, badge)).toBe(false);
    });

    it('should return false if wrong course', () => {
      const wrongCourse = { ...completedProgress, courseId: 'course-other' };
      expect(canEarnBadge(wrongCourse, badge)).toBe(false);
    });
  });
});
