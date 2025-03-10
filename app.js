// 🎵 Playlist Data
let playlist = [
    { id: "xakBzg5atsM", title: "massobeats - rose water (royalty free lofi music)" },
    { id: "HGMQbVfYVmI", title: "massobeats - honey jam (royalty free lofi music)" },
    { id: "6eWIffP2M3Y", title: "(no copyright music) jazz type beat “bread” | royalty free youtube music | prod. by lukrembo)" },
    { id: "KGQNrzqrGqw", title: "(no copyright music) lofi type beat “onion” | prod. by lukrembo)" },
    { id: "y7KYdqVND4o", title: "lukrembo - marshmallow (royalty free vlog music)" }
];

// 🎧 DOM Elements
const elements = {
    playerContainer: document.getElementById("player-container"),
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.getElementById("next"),
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title"),
    progressBar: document.getElementById("progress-bar"),
    progressContainer: document.getElementById("progress-bar").parentElement,
    timeRemaining: document.getElementById("time-remaining"),
    loopSingleButton: document.getElementById("loop-single"),
    loopPlaylistButton: document.getElementById("loop-playlist")
};

let player;
let isPlaying = false;
let currentSongIndex = 0;
let updateInterval;
let loopSingle = false;
let loopPlaylist = false;

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

// 🔹 Handle End of Song
function handleEndOfSong() {
    if (loopSingle) {
        playSong(currentSongIndex);
    } else if (loopPlaylist) {
        playSong(0);
    } else {
        playSong(currentSongIndex + 1);
    }
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

// 🔹 Looping Buttons: Single Song / Playlist
elements.loopSingleButton.addEventListener("click", () => toggleLoopMode('single'));
elements.loopPlaylistButton.addEventListener("click", () => toggleLoopMode('playlist'));

// 🔹 Toggle Loop Mode
function toggleLoopMode(mode) {
    if (mode === 'single') {
        loopSingle = !loopSingle;
        loopPlaylist = false;
    } else if (mode === 'playlist') {
        loopPlaylist = !loopPlaylist;
        loopSingle = false;
    }

    updateLoopButtonState();
}

// 🔹 Update Active Loop Button State
function updateLoopButtonState() {
    elements.loopSingleButton.classList.toggle("active-mode", loopSingle);
    elements.loopPlaylistButton.classList.toggle("active-mode", loopPlaylist);
}

// 🔹 Start the Initialization Process
initialize(); // Call the initialize function to start the process