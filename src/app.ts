import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoutes';
import articleRouter from './routes/articleRoutes';
import commentRouter from './routes/commentRoutes';
import imageRouter from './routes/imageRoutes';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import notificationRouter from './routes/notificationRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/files', express.static('uploads'));

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/images', imageRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/notifications', notificationRouter);

app.use(errorHandler);

export default app;
