import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoutes.js';
import articleRouter from './routes/articleRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server Started');
});
