import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Serve built static frontend files if present
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // Handles both projects and tasks
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// app.get('/api', (req, res) => {
//   res.json({ message: 'AI Workspace SaaS API is running...' });
// });
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'AI Workspace SaaS API',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to the AI Workspace API',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      ai: '/api/ai',
      analytics: '/api/analytics',
      health: '/api/health'
    }
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AI Workspace API is healthy',
    timestamp: new Date().toISOString()
  });
}); 
// SPA fallback routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.json({ message: 'AI Workspace SaaS API is running...' });
    }
  });
});

// Connect database and run
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
