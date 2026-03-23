const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const storeRoutes = require('./routes/storeRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Make io available to routes
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
    console.log(`User ${socket.id} joined room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stores', storeRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
);

app.get('/', (req, res) => {
  res.send('E-Commerce API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server running on port ${PORT}`));
