import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoutes';
import articleRouter from './routes/articleRoutes';
import commentRouter from './routes/commentRoutes';
import imageRouter from './routes/imageRoutes';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler.js';

const app: Express = express();

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

app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
}); 