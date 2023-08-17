import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//use cors
app.use(cors());
//parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//welcome route
app.get('/', (req: Request, res: Response) => {
  res.json('Welcome to Auth Service!');
});
//application route
app.use('/api/v1/', routes);

app.use(globalErrorHandler);

export default app;
