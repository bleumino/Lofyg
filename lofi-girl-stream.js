// 🎵 Playlist Data (Multiple Streams)
let playlist = [
    { id: "jfKfPfyJRdk", title: "24 Hour Lofi Radio" },
    { id: "5qap5aO4i9A", title: "Lofi Hip Hop Beats" },
    { id: "DWcJFNfSxW8", title: "Chill Lofi Study Beats" }
];

let currentSongIndex = 0;

// 🎛️ UI Elements
const elements = {
    playerContainer: document.getElementById("player-container"),
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.createElement("button"),
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title")
};

elements.nextButton.textContent = "Next";
elements.nextButton.id = "next";
document.body.appendChild(elements.nextButton);

// 🎵 YouTube Player API Initialization
let player;
function onYouTubeIframeAPIReady() {
    console.log(`🎵 Loading: ${playlist[currentSongIndex].title}`);
    
    player = new YT.Player('youtube-player', {
        height: '390',
        width: '640',
        videoId: playlist[currentSongIndex].id,
        playerVars: { autoplay: 0, controls: 1, modestbranding: 1, showinfo: 1 },
        events: {
            onReady: onPlayerReady,
            onStateChange: handlePlayerStateChange
        }
    });

    updateQueue();
}

// 🎶 Update Queue Display
function updateQueue() {
    elements.queueList.innerHTML = ""; // Clear previous list
    playlist.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.style.cursor = "pointer";
        listItem.addEventListener("click", () => playSong(index));
        elements.queueList.appendChild(listItem);
    });
}

// 🎧 Update Now Playing Title
function updateSongInfo() {
    if (elements.songTitle) {
        elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
    }
}

// 🎵 Play or Pause
function togglePlayPause() {
    if (!player) return;
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

// ▶️ Play a specific song from the playlist
function playSong(index) {
    if (!player || !player.loadVideoById) {
        console.error("❌ Player not initialized yet.");
        return;
    }
    currentSongIndex = index;
    player.loadVideoById(playlist[currentSongIndex].id);
    updateSongTitle();
    startVinylAnimation();
}

// ⏭ Play Next Song
function playNext() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSong(currentSongIndex);
}

// 🔄 Update Song Title
function updateSongTitle() {
    if (elements.songTitle) {
        elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
    }
}

// 🎚️ Handle YouTube Player State Changes
function handlePlayerStateChange(event) {
    if (!player) return;
    
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            isPlaying = true;
            updateSongTitle();
            startVinylAnimation();
            break;
        case YT.PlayerState.ENDED:
            playNext();
            break;
        case YT.PlayerState.PAUSED:
        case YT.PlayerState.CUED:
        case YT.PlayerState.UNSTARTED:
            isPlaying = false;
            break;
    }
}

// 🎵 Start Vinyl Record Animation
function startVinylAnimation() {
    if (elements.vinylRecord) {
        elements.vinylRecord.classList.toggle("spinning", isPlaying);
    }
}

// 🚀 Initialize
initialize();
elements.playButton.addEventListener("click", togglePlayPause);
elements.nextButton.addEventListener("click", playNext);