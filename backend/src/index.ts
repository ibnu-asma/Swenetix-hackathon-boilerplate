import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import { setupSwagger } from './docs/swagger';
import userRoutes from './routes/user.routes';
import bookRoutes from './routes/books.route';
import categoryRoutes from './routes/category.route';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
setupSwagger(app);
// Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "MERN backend is running" });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);

mongoose.connect(process.env.MONGO_URI ?? "mongodb://localhost:27017/library_db")
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

