// Connect to the server socket
const socket = io();

// Retrieve DOM elements for display
const textDisplay = document.querySelector('#textDisplay');
const totalConnectionsEl = document.querySelector('#totalConnections');
const totalDisconnectionsEl = document.querySelector('#totalDisconnections');
const currentlyConnectedEl = document.querySelector('#currentlyConnected');

// Listen for stats updates from the server
socket.on('stats', (data) => {
  totalConnectionsEl.textContent = data.totalConnections;
  totalDisconnectionsEl.textContent = data.totalDisconnections;
  currentlyConnectedEl.textContent = data.currentlyConnected;
});

// Clear display when a new message starts
socket.on('new-message-start', () => {
  textDisplay.textContent = '';
});

// Append each word as it arrives
socket.on('word', (word) => {
  textDisplay.textContent += (textDisplay.textContent ? ' ' : '') + word;
});