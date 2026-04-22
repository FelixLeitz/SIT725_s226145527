// Create HTTP Server based on Express App
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); 
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (your public folder)
app.use(express.static('public'));

// Connection Logic for Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Startup HTTP Server
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});