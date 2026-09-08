import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { dbService } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import complaintRoutes from './server/routes/complaintRoutes';
import adminRoutes from './server/routes/adminRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database connection / local persistent storage
  await dbService.connect();

  // Middleware for parsing JSON and url-encoded request bodies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Ensure uploads directory exists and serve static uploads
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadDir));

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/admin', adminRoutes);

  // Health and System Info check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'CampusCare — Smart Campus Complaint Management System',
      database: dbService.isMongo() ? 'MongoDB (Connected)' : 'Embedded Persistent Store (Active)',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CampusCare] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting CampusCare server:', err);
  process.exit(1);
});
