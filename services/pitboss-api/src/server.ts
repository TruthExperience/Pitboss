import express from 'express';
import { router } from './routes';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`pitboss-api listening on http://localhost:${port}`);
});
