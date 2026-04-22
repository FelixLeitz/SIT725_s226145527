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

// Serve Static Files
app.use(express.static('public'));

// Tracking Variables for Connections
let totalConnections = 0;
let totalDisconnections = 0;
let currentlyConnected = 0;

// Component List for Dynamic Message Generation
const nouns = ['the park', 'the store', 'the library', 'the beach', 'the gym', 'the market', 'the cinema'];
const continuations = ['buy something', 'read a book', 'meet a friend', 'take a walk', 'have lunch', 'watch a movie'];

// Word-by-word Message Broadcaster
function broadcastMessageWordByWord() {
    // Generate a random noun and continuation for the message
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const continuation = continuations[Math.floor(Math.random() * continuations.length)];
    const fullMessage = `I will go to ${noun} and I will ${continuation}.`;
    // Split the message into individual words for broadcasting
    const words = fullMessage.split(' ');

    let index = 0;

    // Signal clients to clear the display for a new message
    io.emit('new-message-start');

    // Broadcast each word at intervals of 200ms
    const interval = setInterval(() => {
        if (index < words.length) {
            io.emit('word', words[index]);
            index++;
        } else {
            clearInterval(interval);
            // Wait 0.5 second before sending the next message
            setTimeout(broadcastMessageWordByWord, 500);
        }
    }, 200);
}

// Socket.IO Connection Logic
io.on('connection', (socket) => {
    // Update connection stats
    totalConnections++;
    currentlyConnected++;

    // Log connection stats to the server console
    console.log(`User connected | Total: ${totalConnections} | Disconnections: ${totalDisconnections} | Online: ${currentlyConnected}`);

    // Broadcast updated stats to ALL clients
    io.emit('stats', {
        totalConnections,
        totalDisconnections,
        currentlyConnected
    });

    socket.on('disconnect', () => {
        // Update disconnection stats
        totalDisconnections++;
        currentlyConnected--;

        // Log disconnection stats to the server console
        console.log(`User disconnected | Total: ${totalConnections} | Disconnections: ${totalDisconnections} | Online: ${currentlyConnected}`);

        // Broadcast updated stats to ALL remaining clients
        io.emit('stats', {
            totalConnections,
            totalDisconnections,
            currentlyConnected
        });
    });
});

// Start the word-by-word broadcast loop
broadcastMessageWordByWord();

// Startup HTTP Server
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});