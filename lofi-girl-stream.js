// 🎵 Playlist Data
let playlist = [{ id: "jfKfPfyJRdk", title: "24 hour lofi radio" }];

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
let isPlaying = false;
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
    try {
        await loadYouTubeAPI();
        onYouTubeIframeAPIReady();
    } catch (error) {
        console.error(error);
    }
}

// 🔹 Create YouTube Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "0", // Hide it
        width: "0",
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
                event.target.mute(); // Start muted (bypass autoplay block)
                event.target.playVideo();
                setTimeout(() => event.target.unMute(), 1000); // Unmute after 1 sec
                loadQueue();
                updateSongInfo();
            },
            onStateChange: handlePlayerStateChange
        }
    });

    // Fix Chromium API Blocking Issues
    handleChromiumIssues();
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

// 🔹 Update Song Info
function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
}

// 🔹 Play Song
function playSong(index) {
    currentSongIndex = index % playlist.length;
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
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

// 🔹 Skip to Next Song
elements.nextButton.addEventListener("click", () => playSong(currentSongIndex + 1));

// 🔹 Handle Player State Change
function handlePlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        playSong(currentSongIndex + 1);
    } else if (event.data === YT.PlayerState.PAUSED) {
        player.playVideo(); // Auto-resume if Chromium pauses it
    }
}

// 🔹 Keep Vinyl Animation Running
function startVinylAnimation() {
    elements.vinylRecord.classList.toggle("spinning", isPlaying);
}

// 🔹 Update Time & Progress Bar
function updateTime() {
    if (!player || !player.getDuration()) return;
    let duration = player.getDuration();
    let currentTime = player.getCurrentTime();
    elements.progressBar.style.width = (currentTime / duration) * 100 + "%";
}

// 🔹 Start Updating Progress
function startUpdatingTime() {
    clearInterval(updateInterval);
    updateInterval = setInterval(updateTime, 1000);
}

// 🔹 Seek in Song
elements.progressContainer.addEventListener("click", (event) => {
    let seekTo = (event.offsetX / elements.progressContainer.clientWidth) * player.getDuration();
    player.seekTo(seekTo, true);
    updateTime();
});

// 🔹 Fix Chromium API Blocking Issues
function handleChromiumIssues() {
    if (navigator.userAgent.includes("Chrome") || navigator.userAgent.includes("Chromium")) {
        // 🛠️ 1. Clear Cache to Prevent API Lockups
        if ("caches" in window) {
            caches.keys().then(names => names.forEach(name => caches.delete(name)));
        }

        // 🛠️ 2. Auto-Reload Stream if Stuck
        setInterval(() => {
            if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                player.loadVideoById(playlist[currentSongIndex].id);
            }
        }, 30000);
    }
}

// 🔹 Start Initialization
initialize();