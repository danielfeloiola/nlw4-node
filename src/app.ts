import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import createConnection from './database';
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  if(error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'Error',
    message: `Internal Server Error ${error.message}`,
  })
})

export { app };