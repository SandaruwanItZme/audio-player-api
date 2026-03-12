// API Configuration
const AudioPlayerConfig = {
    version: '1.0.0',
    apiEndpoint: 'https://yourusername.github.io/audio-player-api/api/playlist.json',
    defaultArt: 'https://via.placeholder.com/50',
    colors: {
        primary: '#667eea',
        secondary: '#764ba2'
    },
    settings: {
        autoPlay: false,
        shuffle: false,
        repeat: false,
        volume: 0.5
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioPlayerConfig;
}
