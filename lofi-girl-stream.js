// 🎵 Playlist Data
let playlist = [
    { id: "jfKfPfyJRdk", title: "24 hour lofi radio" }
    // Add more songs here
];

// 🎧 DOM Elements
const elements = {
    playerContainer: document.getElementById("player-container"),
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.getElementById("next"), // Add nextButton
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title"),
    progressBar: document.getElementById("progress-bar"),
    progressContainer: document.getElementById("progress-bar").parentElement,
    timeRemaining: document.getElementById("time-remaining")
};

let player;
let isPlaying = false;
let currentSongIndex = 0;
let updateInterval;
let loopSingle = false;
let loopPlaylist = false;

// ... (rest of your code) ...

// 🔹 Play Song (updated)
function playSong(index) {
    currentSongIndex = index; // Update current song index
    player.loadVideoById(playlist[currentSongIndex].id);
    player.playVideo();
    updateSongInfo();
    resetProgressBar();
    startVinylAnimation();
    startUpdatingTime(); // Start updating time and progress
}

// 🔹 Skip to Next Song
elements.nextButton.addEventListener("click", () => {
    playSong(currentSongIndex + 1);
});

// ... (rest of your code) ...

// 🔹 Update Time and Progress Bar (updated)
function updateTime() {
    if (!player || !player.getDuration()) return;

    let duration = player.getDuration();
    let currentTime = player.getCurrentTime();
    let remainingTime = duration - currentTime;

    elements.progressBar.style.width = (currentTime / duration) * 100 + "%";

    let minutes = Math.floor(remainingTime / 60);
    let seconds = Math.floor(remainingTime % 60);
    elements.timeRemaining.textContent = `-${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Update timeRemaining
}

// ... (rest of your code) ...