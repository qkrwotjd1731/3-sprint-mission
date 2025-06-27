import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import productRouter from './routes/productRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static('uploads'));

app.use('/products', productRouter);
app.use('/images', imageRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server Started');
});
