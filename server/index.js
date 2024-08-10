// server.js
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// POST route to handle text input and generate speech
app.post('/api/generate', async (req, res) => {
    const { text } = req.body;
  
    try {
        // Call the TTS API (example with Google Cloud TTS)
        const response = await axios.post('https://texttospeech.googleapis.com/v1/text:synthesize', {
            input: { text },
            voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
            audioConfig: { audioEncoding: 'MP3' },
        }, {
            headers: {
                'Authorization': `Bearer YOUR_GOOGLE_CLOUD_API_KEY`,
                'Content-Type': 'application/json',
            },
        });

        const audioContent = response.data.audioContent;
        const audioPath = path.join(__dirname, 'speech.mp3');
        fs.writeFileSync(audioPath, audioContent, 'base64');

        res.json({ audioUrl: `/speech.mp3` });
    } catch (error) {
        console.error('Error generating speech:', error);
        res.status(500).send('Error generating speech');
    }
});

// Serve the generated speech file
app.use('/speech.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, 'speech.mp3'));
});

// Serve the front-end
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port localhost:// ${PORT}`));
