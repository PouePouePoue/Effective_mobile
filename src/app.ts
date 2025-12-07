import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(cors());

app.use('/api', router);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;