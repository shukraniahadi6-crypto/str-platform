import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { limiter } from './middleware/rateLimit';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(limiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV });
});

app.use(env.API_PREFIX, routes);
app.use(notFoundHandler);
app.use(errorHandler);
