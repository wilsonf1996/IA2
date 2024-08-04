const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let conversationHistory = []; // Armazenar histórico de conversas

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Adicionar mensagem do usuário ao histórico
    conversationHistory.push({ role: 'user', content: userMessage });

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: generatePrompt(conversationHistory),
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                'Content-Type': 'application/json'
            }
        });

        const botMessage = response.data.choices[0].text.trim();

        // Adicionar mensagem do bot ao histórico
        conversationHistory.push({ role: 'assistant', content: botMessage });

        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).send('Internal Server Error');
    }
});

function generatePrompt(history) {
    return history.map(entry => `${entry.role}: ${entry.content}`).join('\n') + '\nassistant:';
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

