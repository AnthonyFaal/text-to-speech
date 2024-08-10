document.getElementById('textForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = document.getElementById('textInput').value;
    const errorDiv = document.getElementById('error');
    const audioControls = document.getElementById('audioControls');
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadButton = document.getElementById('downloadButton');
    const loader = document.getElementById('loader');

    errorDiv.classList.add('hidden');
    audioControls.classList.add('hidden');
    loader.classList.remove('hidden');

    if (!text.trim()) {
        loader.classList.add('hidden');
        errorDiv.textContent = 'Please enter some text.';
        errorDiv.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        const audioUrl = data.audioUrl;

        audioPlayer.src = audioUrl;
        audioControls.classList.remove('hidden');
        downloadButton.href = audioUrl;
        downloadButton.download = 'speech.mp3';
        downloadButton.textContent = 'Download Speech';

    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = 'Error generating speech. Please try again.';
        errorDiv.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
});
