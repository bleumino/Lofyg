// 🎵 Playlist Data
let playlist = [
    { id: "jfKfPfyJRdk", title: "24 hour lofi radio" } // Only the live stream
];

// 🎧 DOM Elements
const elements = {
    playerContainer: document.getElementById("player-container"),
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.getElementById("next"),
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title")
};

let player;
let isPlaying = false;
let currentSongIndex = 0;

// 🔹 Load YouTube IFrame API (Ensure Asynchronous Loading)
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => resolve();
        script.onerror = () => reject("Error loading YouTube API");
        document.head.appendChild(script);
    });
}

// 🔹 Initialize Player and Load Queue (After API is Ready)
async function initialize() {
    try {
        await loadYouTubeAPI();
        onYouTubeIframeAPIReady();
    } catch (error) {
        console.error(error);
    }
}

// 🔹 Load YouTube IFrame API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '390',
        width: '640',
        videoId: playlist[currentSongIndex].id,
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            fs: 0
        },
        events: {
            onReady: () => {
                loadQueue();
                updateSongInfo();
            },
            onStateChange: handlePlayerStateChange
        }
    });
}

// 🔹 Load Queue
function loadQueue() {
    elements.queueList.innerHTML = "";
    playlist.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.addEventListener("click", () => playSong(index));
        elements.queueList.appendChild(listItem);
    });
}

// 🔹 Update Song Information
function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
}

// 🔹 Play Song
function playSong(index) {
    if (index >= playlist.length) index = 0;
    currentSongIndex = index;
    player.loadVideoById(playlist[currentSongIndex].id);
    player.playVideo();
    updateSongInfo();
    startVinylAnimation();
}

// 🔹 Toggle Play/Pause
elements.playButton.addEventListener("click", () => {
    isPlaying ? player.pauseVideo() : player.playVideo();
});

// 🔹 Skip to Next Song
elements.nextButton.addEventListener("click", () => {
    playSong(currentSongIndex + 1);
});

// 🔹 Handle Player State Change
function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            isPlaying = true;
            break;
        case YT.PlayerState.PAUSED:
            isPlaying = false;
            break;
    }
    startVinylAnimation();
}

// 🔹 Update Vinyl Record Animation
function startVinylAnimation() {
    elements.vinylRecord.classList.toggle("spinning", isPlaying);
}

// 🔹 Start the Initialization Process
initialize();