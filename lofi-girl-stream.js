// 🎵 Playlist Data
let playlist = [ 
    { id: "jfKfPfyJRdk", title: "24 hour lofi radio" } // Make sure to replace with your own YouTube Live stream ID if needed
];

// 🎧 DOM Elements
const elements = {
playerContainer: document.getElementById("player-container"),
queueList: document.getElementById("queue"),
vinylRecord: document.getElementById("vinyl"),
songTitle: document.getElementById("song-title"),
progressBar: document.getElementById("progress-bar"),
progressContainer: document.getElementById("progress-bar").parentElement,
timeRemaining: document.getElementById("time-remaining"),
playButton: document.getElementById("play") // Ensure playButton exists in your HTML
};

let player;
let isPlaying = false;
let currentSongIndex = 0;
let updateInterval;

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
    await loadYouTubeAPI(); // Wait for YouTube API to load
    onYouTubeIframeAPIReady(); // Initialize the player
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
        autoplay: 1,  // Enable autoplay when the player is ready
        controls: 1,   // Show controls
        modestbranding: 1, // Hide YouTube logo
        showinfo: 0,   // Hide video info
        rel: 0,        // Disable related videos
        fs: 0,         // Disable fullscreen button
        iv_load_policy: 3, // Disable annotations
        cc_load_policy: 0, // Disable closed captions
        enablejsapi: 1  // Enable JS API for interactions
    },
    events: {
        onReady: () => {
            loadQueue();
            updateSongInfo();
            player.playVideo();  // Start playing the video immediately on ready
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
resetProgressBar();
startVinylAnimation();
}

// 🔹 Reset Progress Bar
function resetProgressBar() {
elements.progressBar.style.width = "0%";
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
    case YT.PlayerState.ENDED:
        handleEndOfSong();
        break;
    case YT.PlayerState.PLAYING:
        isPlaying = true;
        startUpdatingTime();
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

// 🔹 Update Time and Progress Bar
function updateTime() {
if (!player || !player.getDuration()) return;

let duration = player.getDuration();
let currentTime = player.getCurrentTime();

// Ensure that the time isn't negative
if (currentTime < 0 || duration < 0) return;

let remainingTime = duration - currentTime;

elements.progressBar.style.width = (currentTime / duration) * 100 + "%";

let minutes = Math.floor(remainingTime / 60);
let seconds = Math.floor(remainingTime % 60);
elements.timeRemaining.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// 🔹 Start Updating Time Every Second
function startUpdatingTime() {
clearInterval(updateInterval);
updateInterval = setInterval(updateTime, 1000);
}

// 🔹 Seek Through Song
elements.progressContainer.addEventListener("click", (event) => {
if (!player || !player.getDuration()) return;

let barWidth = elements.progressContainer.clientWidth;
let clickPosition = event.offsetX;
let seekTo = (clickPosition / barWidth) * player.getDuration();

player.seekTo(seekTo, true);
updateTime();
});

// 🔹 Start the Initialization Process
initialize(); // Call the initialize function to start the process