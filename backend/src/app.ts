import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import contactRoutes from './routes/contactRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/wishlists', wishlistRoutes);
app.use('/contact', contactRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app; 