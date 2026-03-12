// Audio Player API
class AudioPlayerAPI {
    constructor() {
        this.audio = document.getElementById('audioElement');
        this.playlist = [];
        this.currentTrack = 0;
        this.isPlaying = false;
        this.apiEndpoint = document.getElementById('audioPlayerAPI')?.dataset.playlist || 'api/playlist.json';
        
        this.init();
    }
    
    async init() {
        await this.loadPlaylist();
        this.cacheElements();
        this.setupEventListeners();
        this.loadTrack(0);
        this.renderPlaylist();
    }
    
    cacheElements() {
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.progressBar = document.getElementById('progressBar');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.playerTitle = document.getElementById('playerTitle');
        this.playerArtist = document.getElementById('playerArtist');
        this.playerArt = document.getElementById('playerArt');
        this.playlistItems = document.getElementById('playlistItems');
        this.playlistToggle = document.getElementById('playlistToggle');
        this.playlistContainer = document.getElementById('playlistContainer');
    }
    
    async loadPlaylist() {
        try {
            // Try to fetch from API endpoint
            const response = await fetch(this.apiEndpoint);
            if (response.ok) {
                const data = await response.json();
                this.playlist = data.tracks;
            } else {
                // Fallback to default playlist
                this.playlist = [
                    {
                        id: 1,
                        title: 'Track 1',
                        artist: 'Janaka Heshan',
                        src: 'songs/abc.mp3',
                        duration: '3:30',
                        art: 'https://via.placeholder.com/50'
                    },
                    {
                        id: 2,
                        title: 'Track 2',
                        artist: 'Janaka Heshan',
                        src: 'songs/xyz.mp3',
                        duration: '4:00',
                        art: 'https://via.placeholder.com/50'
                    }
                ];
            }
        } catch (error) {
            console.log('Using default playlist');
            // Use default playlist
            this.playlist = [
                {
                    id: 1,
                    title: 'Track 1',
                    artist: 'Janaka Heshan',
                    src: 'songs/abc.mp3',
                    duration: '3:30',
                    art: 'https://via.placeholder.com/50'
                },
                {
                    id: 2,
                    title: 'Track 2',
                    artist: 'Janaka Heshan',
                    src: 'songs/xyz.mp3',
                    duration: '4:00',
                    art: 'https://via.placeholder.com/50'
                }
            ];
        }
    }
    
    setupEventListeners() {
        // Play/Pause
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        
        // Previous/Next
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Volume
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value;
            this.updateVolumeIcon(e.target.value);
        });
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.nextTrack());
        
        // Playlist toggle
        if (this.playlistToggle) {
            this.playlistToggle.addEventListener('click', () => {
                this.playlistItems.classList.toggle('collapsed');
                this.playlistToggle.classList.toggle('fa-chevron-down');
                this.playlistToggle.classList.toggle('fa-chevron-up');
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowRight' && e.ctrlKey) {
                this.nextTrack();
            } else if (e.code === 'ArrowLeft' && e.ctrlKey) {
                this.prevTrack();
            }
        });
    }
    
    loadTrack(index) {
        if (!this.playlist.length) return;
        
        this.currentTrack = index;
        const track = this.playlist[index];
        
        this.audio.src = track.src;
        this.playerTitle.textContent = track.title;
        this.playerArtist.textContent = track.artist;
        this.playerArt.src = track.art || 'https://via.placeholder.com/50';
        
        this.audio.load();
        
        // Update active playlist item
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        if (this.isPlaying) {
            this.audio.play().catch(() => {});
        }
    }
    
    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            this.audio.pause();
            this.isPlaying = false;
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    nextTrack() {
        const next = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(next);
    }
    
    prevTrack() {
        const prev = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(prev);
    }
    
    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.updateVolumeIcon(this.audio.muted ? 0 : this.audio.volume);
    }
    
    updateVolumeIcon(volume) {
        let icon = 'fa-volume-up';
        if (volume == 0 || this.audio.muted) icon = 'fa-volume-mute';
        else if (volume < 0.5) icon = 'fa-volume-down';
        this.volumeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = percent + '%';
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    renderPlaylist() {
        if (!this.playlistItems) return;
        
        this.playlistItems.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${index === 0 ? 'active' : ''}`;
            item.innerHTML = `
                <img src="${track.art || 'https://via.placeholder.com/40'}" alt="${track.title}">
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${track.title}</div>
                    <div class="playlist-item-artist">${track.artist}</div>
                </div>
                <div class="playlist-item-duration">${track.duration || '3:30'}</div>
            `;
            
            item.addEventListener('click', () => {
                this.loadTrack(index);
                if (this.audio.paused) {
                    this.togglePlay();
                }
            });
            
            this.playlistItems.appendChild(item);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('audioPlayerAPI')) {
        window.audioPlayer = new AudioPlayerAPI();
    }
});
