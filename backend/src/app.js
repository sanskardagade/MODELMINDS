const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const prisma = require('./config/db');
const errorHandler = require('./middlewares/error.middleware');
const { securityHeaders } = require('./middlewares/security.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const projectImageRoutes = require('./routes/projectImage.routes');
const employeeRoutes = require('./routes/employee.routes');
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const galleryRoutes = require('./routes/gallery.routes');
const publicRoutes = require('./routes/public.routes');
const messageRoutes = require('./routes/message.routes');

const app = express();

// Security: Limit request size
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use(securityHeaders);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'ok', 
    message: 'Server is running' 
  });
});

// Public API Routes (no auth required)
app.use('/api/public', publicRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-images', projectImageRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/messages', messageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;

