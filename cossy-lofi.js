let playlist = [
    { id: "ITxr30JqOGk", title: "Elin John Svensson - Blue Rainbow (official audio)" },
    { id: "3s7_IVSAn0Y", title: "Elin John Svensson - Blue silence night (official audio)" },
    { id: "CkMDYBZj9Tc", title: "Elin John Svensson - Blue Ocean Skies (official audio)" },
    { id: "WdbPKuC2T3Y", title: "Elin John Svensson - Blue juice orange (official audio)" },
];

// DOM Elements
const elements = {
    playerContainer: document.getElementById("player-container"),
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.getElementById("next"),
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title"),
    progressBar: document.getElementById("progress-bar"),
    progressContainer: document.getElementById("progress-bar")?.parentElement,
    timeRemaining: document.getElementById("time-remaining"),
};

let player;
let isPlaying = false;
let currentSongIndex = 0;
let updateInterval;
let isLooping = false;
let notificationTimeout;

// Request notification permission
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

// Load YouTube API
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// YouTube API callback
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "390",
        width: "640",
        videoId: playlist[currentSongIndex].id,
        playerVars: { autoplay: 0, controls: 1, modestbranding: 1, rel: 0, fs: 0 },
        events: {
            onReady: () => {
                loadQueue();
                updateSongInfo();
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}

function initialize() {
    if (window.YT?.Player) {
        onYouTubeIframeAPIReady();
    } else {
        setTimeout(initialize, 500);
    }
}

function loadQueue() {
    elements.queueList.innerHTML = "";
    playlist.forEach((song, index) => {
        if (!isValidYouTubeId(song.id)) return;
        const li = document.createElement("li");
        li.textContent = sanitizeTitle(song.title);
        li.dataset.index = index;
        li.style.cursor = "pointer";
        li.classList.toggle("active-song", index === currentSongIndex);
        li.addEventListener("click", () => playSong(index));
        elements.queueList.appendChild(li);
    });
}

function sanitizeTitle(title) {
    const div = document.createElement("div");
    div.innerText = title;
    return div.innerHTML;
}

function isValidYouTubeId(id) {
    return typeof id === "string" && id.length === 11;
}

function updateSongInfo() {
    const title = sanitizeTitle(playlist[currentSongIndex].title);
    elements.songTitle.textContent = `Now Playing: ${title}`;

    loadQueue();

    if (Notification.permission === "granted") {
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            new Notification("🎶 Now Playing", {
                body: title,
                icon: "logo.png"
            });
        }, 300);
    }

    const popup = document.getElementById("now-playing-popup");
    const popupText = document.getElementById("now-playing-text");
    if (popup && popupText) {
        popupText.textContent = `Now Playing: ${title}`;
        popup.style.opacity = "1";
        setTimeout(() => popup.style.opacity = "0", 3000);
    }
}

function playSong(index, skipped = 0) {
    if (index >= playlist.length) index = 0;
    if (index < 0) index = playlist.length - 1;
    if (skipped >= playlist.length) return;

    const song = playlist[index];
    if (!isValidYouTubeId(song.id)) {
        playSong(index + 1, skipped + 1);
        return;
    }

    currentSongIndex = index;
    player.loadVideoById(song.id);
    player.playVideo();

    updateSongInfo();
    resetProgressBar();
    startVinylAnimation();
}

function resetProgressBar() {
    elements.progressBar.style.width = "0%";
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [
        hrs > 0 ? String(hrs).padStart(2, "0") : null,
        String(mins).padStart(2, "0"),
        String(secs).padStart(2, "0")
    ].filter(Boolean).join(":");
}

function updateTime() {
    if (!player?.getDuration()) return;
    const duration = player.getDuration();
    const currentTime = player.getCurrentTime();

    elements.progressBar.style.width = `${(currentTime / duration) * 100}%`;
    elements.timeRemaining.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}


function startUpdatingTime() {
    clearInterval(updateInterval);
    updateInterval = setInterval(updateTime, 1000);
}

function startVinylAnimation() {
    if (elements.vinylRecord) {
        elements.vinylRecord.classList.toggle("spinning", isPlaying);
        elements.vinylRecord.classList.toggle("pulsing", isPlaying);
    }
}

function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            isLooping ? playSong(currentSongIndex) : playSong(currentSongIndex + 1);
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

function handlePlayerError(event) {
    console.warn("YouTube Player Error:", event.data);
    playSong(currentSongIndex + 1);
}

// Buttons
elements.playButton?.addEventListener("click", () => {
    isPlaying ? player.pauseVideo() : player.playVideo();
    isPlaying = !isPlaying;
    startVinylAnimation();
});

elements.nextButton?.addEventListener("click", () => {
    playSong(currentSongIndex + 1);
});

elements.progressContainer?.addEventListener("click", (event) => {
    if (!player?.getDuration()) return;
    const width = elements.progressContainer.clientWidth;
    const clickX = event.offsetX;
    const seekTo = (clickX / width) * player.getDuration();
    player.seekTo(seekTo, true);
    updateTime();
});

document.getElementById("loop-single")?.addEventListener("click", () => {
    isLooping = !isLooping;
    document.getElementById("loop-single").classList.toggle("active-mode", isLooping);
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) player.playVideo();
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        isPlaying ? player.pauseVideo() : player.playVideo();
        isPlaying = !isPlaying;
        startVinylAnimation();
    }
});

document.addEventListener("click", e => {
    for (let i = 0; i < 8; i++) {
        const fleck = document.createElement('div');
        fleck.classList.add('particle');
        fleck.style.left = e.clientX + 'px';
        fleck.style.top = e.clientY + 'px';

        const angle = Math.random() * 2 * Math.PI;
        const distance = 40 + Math.random() * 20;
        fleck.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        fleck.style.setProperty('--y', `${Math.sin(angle) * distance}px`);

        fleck.addEventListener('animationend', () => fleck.remove());
        document.body.appendChild(fleck);
    }
});

// Start
loadYouTubeAPI().then(initialize);

const volumeSlider = document.getElementById("volume-slider");

volumeSlider.addEventListener("input", () => {
    const volume = parseInt(volumeSlider.value, 10);
    if (player && typeof player.setVolume === "function") {
        player.setVolume(volume);
    }
});

function updateLocalTime() {
  const timeElement = document.getElementById('local-time');
  const iconElement = document.getElementById('time-icon');
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;

  // Set time-based icon
  let icon = '⏳';
  if (hours >= 5 && hours < 11) icon = '🌅';        // Morning
  else if (hours >= 11 && hours < 17) icon = '🌞';   // Afternoon
  else if (hours >= 17 && hours < 21) icon = '🌇';   // Evening
  else icon = '🌙';                                  // Night

  iconElement.textContent = icon;
}

// Start the clock
updateLocalTime();
setInterval(updateLocalTime, 1000); // Update every second

