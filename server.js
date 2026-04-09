require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const collectionsRouter = require('./routes/collections');
const partiesRouter = require('./routes/parties');
const ghausiaLotsRouter = require('./routes/ghausiaLots');
const paymentsRouter = require('./routes/payments');
const partyLedgerRouter = require('./routes/partyLedger');
const partyEditsRouter = require('./routes/partyEdits');
const rateCalculationsRouter = require('./routes/rateCalculations');
const savedDesignsRouter = require('./routes/savedDesigns');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const server = http.createServer(app);

// Determine allowed origins
const getAllowedOrigins = () => {
  const corsOrigin = process.env.CORS_ORIGIN || 'https://waqas-emb-backend.onrender.com/';
  if (corsOrigin.includes(',')) {
    return corsOrigin.split(',').map(origin => origin.trim());
  }
  return [corsOrigin];
};

const allowedOrigins = getAllowedOrigins();

// Socket.io setup for real-time updates
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // You can add event listeners for real-time updates
  socket.on('data-update', (data) => {
    // Broadcast updates to all connected clients
    io.emit('data-update', data);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/collections', collectionsRouter);
app.use('/api/parties', partiesRouter);
app.use('/api/ghausiaLots', ghausiaLotsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/partyLedger', partyLedgerRouter);
app.use('/api/partyEdits', partyEditsRouter);
app.use('/api/rateCalculations', rateCalculationsRouter);
app.use('/api/savedDesigns', savedDesignsRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on https://waqas-emb-backend.onrender.com/`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
