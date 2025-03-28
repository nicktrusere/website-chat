const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const CHAT_FILE = path.join(__dirname, 'chatHistory.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure chat history file exists
async function initializeChatFile() {
    try {
        await fs.access(CHAT_FILE);
    } catch {
        await fs.writeFile(CHAT_FILE, JSON.stringify({}));
    }
}

// Get chat history for a user
app.get('/api/chat-history/:userId', async (req, res) => {
    try {
        const data = await fs.readFile(CHAT_FILE, 'utf8');
        const chatData = JSON.parse(data);
        const userHistory = chatData[req.params.userId] || [];
        res.json(userHistory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load chat history' });
    }
});

// Save chat history for a user
app.post('/api/chat-history/:userId', async (req, res) => {
    try {
        const data = await fs.readFile(CHAT_FILE, 'utf8');
        const chatData = JSON.parse(data);
        chatData[req.params.userId] = req.body;
        await fs.writeFile(CHAT_FILE, JSON.stringify(chatData, null, 2));
        res.status(200).json({ message: 'Chat history saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save chat history' });
    }
});

// Clear chat history for a user
app.delete('/api/chat-history/:userId', async (req, res) => {
    try {
        const data = await fs.readFile(CHAT_FILE, 'utf8');
        const chatData = JSON.parse(data);
        chatData[req.params.userId] = [];
        await fs.writeFile(CHAT_FILE, JSON.stringify(chatData, null, 2));
        res.status(200).json({ message: 'Chat history cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear chat history' });
    }
});

// Start the server
initializeChatFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});