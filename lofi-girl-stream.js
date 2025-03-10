// 🎵 Playlist Data
let playlist = [
    { id: "jfKfPfyJRdk", title: "24 hour lofi radio" },
    { id: "M7lc1UVf-VE", title: "Chill beats to study to" },
    // Add more songs here
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
    playButton: document.getElementById("play"),
    nextButton: document.getElementById("next")
};

let player;
let currentSongIndex = 0;
let updateInterval;

// 🔹 Load YouTube IFrame API
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        if (window.YT) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = resolve;
        script.onerror = () => reject("Error loading YouTube API");
        document.head.appendChild(script);
    });
}

// 🔹 Initialize YouTube Player
async function initialize() {
    await loadYouTubeAPI();
    onYouTubeIframeAPIReady();
}

// 🔹 Create YouTube Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "315", // Visible size
        width: "560",  // Visible size
        videoId: playlist[currentSongIndex].id,
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            fs: 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
            enablejsapi: 1
        },
        events: {
            onReady: (event) => {
                event.target.playVideo();
                updateSongInfo();
            }
        }
    });
}

// 🔹 Load Playlist
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

// 🔹 Update Song Info
function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
}

// 🔹 Play Song
function playSong(index) {
    currentSongIndex = index;
    player.loadVideoById(playlist[currentSongIndex].id);
    player.playVideo();
    updateSongInfo();
}

// 🔹 Start Initialization
initialize();