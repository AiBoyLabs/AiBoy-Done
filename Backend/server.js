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

// OpenAI chat route
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Validate message
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });

        res.json({ 
            reply: completion.choices[0].message.content 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
