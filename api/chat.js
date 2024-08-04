// api/chat.js

import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message, conversationHistory } = req.body;

        try {
            const response = await axios.post('https://api.openai.com/v1/completions', {
                model: 'text-davinci-003',
                prompt: generatePrompt(conversationHistory || []),
                max_tokens: 150
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const botMessage = response.data.choices[0].text.trim();

            res.status(200).json({ message: botMessage });
        } catch (error) {
            console.error('Error communicating with OpenAI:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}

function generatePrompt(history) {
    return history.map(entry => `${entry.role}: ${entry.content}`).join('\n') + '\nassistant:';
}
