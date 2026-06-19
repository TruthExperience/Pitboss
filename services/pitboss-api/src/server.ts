import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();
const PORT = Number(process.env.PORT) ?? 4000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://pitboss-beryl.vercel.app',
  'https://pitboss1.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

app.use('/', router);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`PitBoss API running on port ${PORT}`);
});
