import { mailer } from '../config/email';

export const sendTemplatedEmail = async (input: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  await mailer.sendMail({
    from: 'no-reply@str-platform.local',
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
};
