// 🎵 Playlist Data
let playlist = [
    { id: "jfKfPfyJRdk", title: "24 Hour Lofi Radio" } // Live stream
];

// 🎧 DOM Elements
const elements = {
    playerContainer: document.getElementById("player-container"),
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.getElementById("next"),
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title"),
    youtubePlayer: document.getElementById("youtube-player")
};

let player;
let isPlaying = false;
let currentSongIndex = 0;

// 🔹 Load YouTube IFrame API (Ensure Asynchronous Loading)
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) {
            resolve(); // API already loaded
            return;
        }

        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => resolve();
        script.onerror = () => reject("Error loading YouTube API");
        document.head.appendChild(script);
    });
}

// 🔹 Initialize Player after API is Ready
async function initialize() {
    try {
        await loadYouTubeAPI();
        console.log("YouTube IFrame API loaded.");
        if (typeof YT !== "undefined" && YT.Player) {
            onYouTubeIframeAPIReady();
        } else {
            console.error("YouTube API failed to load.");
        }
    } catch (error) {
        console.error(error);
    }
}

// 🔹 YouTube API Callback
function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API is ready.");
    if (!elements.youtubePlayer) {
        console.error("YouTube player container not found.");
        return;
    }

    player = new YT.Player('youtube-player', {
        height: '390',
        width: '640',
        videoId: playlist[currentSongIndex].id,
        playerVars: {
            autoplay: 0,  // Set to 0, user interaction required
            controls: 1,
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            fs: 0,
            playsinline: 1 // Allow inline playback on mobile
        },
        events: {
            onReady: (event) => {
                console.log("YouTube Player Ready");
                loadQueue();
                updateSongInfo();
            },
            onStateChange: handlePlayerStateChange
        }
    });
}

// 🔹 Load Queue
function loadQueue() {
    if (!elements.queueList) return;
    
    elements.queueList.innerHTML = "";
    playlist.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.addEventListener("click", () => playSong(index));
        elements.queueList.appendChild(listItem);
    });
}

// 🔹 Update Song Info
function updateSongInfo() {
    if (elements.songTitle) {
        elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
    }
}

// 🔹 Play Song
function playSong(index) {
    if (!player || !player.loadVideoById) {
        console.error("Player not initialized yet.");
        return;
    }
    
    if (index >= playlist.length) index = 0;
    currentSongIndex = index;
    
    player.loadVideoById(playlist[currentSongIndex].id);
    player.playVideo();
    updateSongInfo();
    startVinylAnimation();
}

// 🔹 Toggle Play/Pause with Button Click
elements.playButton.addEventListener("click", () => {
    if (!player || typeof player.playVideo !== "function") {
        console.log("Player not ready, initializing...");
        onYouTubeIframeAPIReady();
        return;
    }
    
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

// 🔹 Handle Player State Change
function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            isPlaying = true;
            updateSongInfo();
            break;
        case YT.PlayerState.PAUSED:
            isPlaying = false;
            break;
        case YT.PlayerState.ENDED:
            console.log("Live stream ended? Restarting...");
            playSong(currentSongIndex); // Restart live stream if it stops
            break;
    }
    startVinylAnimation();
}

// 🔹 Update Vinyl Record Animation
function startVinylAnimation() {
    if (elements.vinylRecord) {
        elements.vinylRecord.classList.toggle("spinning", isPlaying);
    }
}

// 🔹 Start Initialization
initialize();