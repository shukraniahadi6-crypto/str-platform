import { app } from './app';
import { env } from './config/env';
import { initializeDatabase } from './utils/database';

const start = async (): Promise<void> => {
  await initializeDatabase();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`STR backend listening on ${env.PORT}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
