const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: "Hello from backend!" });
});

// Chat route with better error handling
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Validate message
        if (!message) {
            console.log('No message received');
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Received message:', message); // Add debug log

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });

        const reply = completion.choices[0].message.content;
        console.log('OpenAI response:', reply); // Add debug log

        res.json({ reply });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
