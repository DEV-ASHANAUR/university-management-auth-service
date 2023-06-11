import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoute } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();

//use cors
app.use(cors());
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//welcome route
app.get('/', (req: Request, res: Response) => {
  res.json('Welcome to Auth Service!');
});
//application route
app.use('/api/v1/users', UserRoute);

app.use(globalErrorHandler);

export default app;
