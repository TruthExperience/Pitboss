import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();
const PORT = Number(process.env.PORT) ?? 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
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
