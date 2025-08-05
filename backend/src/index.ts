import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

import connectDB from './utils/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import sessionRoutes from './routes/sessions';
import matchRoutes from './routes/matches';
import messageRoutes from './routes/messages';
import themeRoutes from './routes/themes';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/matches', matchRoutes);
app.use('/messages', messageRoutes);
app.use('/themes', themeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-match', (matchId: string) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined match ${matchId}`);
  });

  socket.on('leave-match', (matchId: string) => {
    socket.leave(matchId);
    console.log(`User ${socket.id} left match ${matchId}`);
  });

  socket.on('send-message', (data) => {
    socket.to(data.matchId).emit('new-message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.matchId).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Catch-all route for 404s
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
  });
});

server.listen(
  { port: PORT, host: '0.0.0.0' },
  () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📱 Mobile apps can connect to: http://192.168.235.186:${PORT}`);
  console.log(`💻 Local access: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://192.168.235.186:${PORT}/health`);
});