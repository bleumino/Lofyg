let playlist = [
    { id: "ITxr30JqOGk", title: "Elin John Svensson - Blue Rainbow (official audio)" },
    { id: "3s7_IVSAn0Y", title: "Elin John Svensson - Blue silence night (official audio)" },
    { id: "CkMDYBZj9Tc", title: "Elin John Svensson - Blue Ocean Skies (official audio)" },
    { id: "WdbPKuC2T3Y", title: "Elin John Svensson - Blue juice orange (official audio)" },
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
    progressContainer: document.getElementById("progress-bar")?.parentElement,
    timeRemaining: document.getElementById("time-remaining"),
};

let player;
let isPlaying = false;
let currentSongIndex = 0;
let updateInterval;


if ("Notification" in window) {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
}

// 🔹 Load YouTube IFrame API
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
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

// 🔹 YouTube API Callback
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
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}

// 🔹 Load Queue List
function loadQueue() {
    elements.queueList.innerHTML = "";
    playlist.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;

        listItem.style.cursor = "pointer"; // Ensure cursor is a pointer
        listItem.addEventListener("mouseover", () => {
            listItem.style.cursor = "pointer";
        });
        listItem.addEventListener("mouseout", () => {
            listItem.style.cursor = "default";
        });

        listItem.addEventListener("click", (event) => {
            let clickedIndex = parseInt(event.currentTarget.dataset.index, 10);
            console.log(`Queue clicked: ${clickedIndex}`);
            playSong(clickedIndex);
        });

        elements.queueList.appendChild(listItem);
    });
}

function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${currentPlaylist[currentSongIndex].title}`;
   showNowPlayingNotification(playlist[currentSongIndex].title);
}

function showNowPlayingNotification(title) {
    if (Notification.permission === "granted") {
        new Notification("🎶 Now Playing", {
            body: title,
            icon: "logo.png" // or any image you like!
        });
    }
}

// 🔹 Play Song with Error Handling
function playSong(index, skippedCount = 0) {
    if (index >= playlist.length) index = 0; // Loop back if end of list
    if (index < 0) index = playlist.length - 1; // Wrap around to last song

    if (skippedCount >= playlist.length) {
        console.error("No valid videos found in the playlist.");
        return;
    }

    currentSongIndex = index;
    let videoId = playlist[currentSongIndex].id;

    if (!videoId || videoId.length < 10) {
        console.warn(`Skipping invalid video: ${playlist[currentSongIndex].title}`);
        playSong(index + 1, skippedCount + 1); // Prevent infinite recursion
        return;
    }

    player.loadVideoById(videoId);
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
if (elements.playButton) {
    elements.playButton.addEventListener("click", () => {
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        isPlaying = !isPlaying; // Fix toggling state
    });
}

// 🔹 Skip to Next Song
if (elements.nextButton) {
    elements.nextButton.addEventListener("click", () => {
        playSong(currentSongIndex + 1);
    });
}

// 🔹 Handle Player State Change
function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            playSong(currentSongIndex + 1);
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

// 🔹 Handle YouTube API Errors
function handlePlayerError(event) {
    console.error(`YouTube Player Error: ${event.data}`);
    console.warn(`Skipping broken video: ${playlist[currentSongIndex].title}`);
    playSong(currentSongIndex + 1);
}

// 🔹 Update Vinyl Record Animation
function startVinylAnimation() {
    if (elements.vinylRecord) {
        elements.vinylRecord.classList.toggle("spinning", isPlaying);
    }
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
if (elements.progressContainer) {
    elements.progressContainer.addEventListener("click", (event) => {
        if (!player || !player.getDuration()) return;

        let barWidth = elements.progressContainer.clientWidth;
        let clickPosition = event.offsetX;
        let seekTo = (clickPosition / barWidth) * player.getDuration();

        player.seekTo(seekTo, true);
        updateTime();
    });
}
function startVinylAnimation() {
    if (elements.vinylRecord) {
        elements.vinylRecord.classList.toggle("spinning", isPlaying);

        if (isPlaying) {
            elements.vinylRecord.classList.add("pulsing");
            console.log("✨ Glow added!"); // Debug message
        } else {
            elements.vinylRecord.classList.remove("pulsing");
            console.log("🚫 Glow removed!");
        }
    }
}


function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
    
    // 🎶 Show Now Playing Popup
    const popup = document.getElementById("now-playing-popup");
    const popupText = document.getElementById("now-playing-text");
    
    popupText.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
    popup.style.opacity = "1"; // Show the popup
    
    // Hide after 3 seconds
    setTimeout(() => {
        popup.style.opacity = "0";
    }, 3000);
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) {
        console.log("🔇 Page hidden, keeping music playing...");
        player.playVideo(); // Ensures music keeps playing
    } else {
        console.log("🎵 Page visible, continuing playback...");
    }
});
// 🔹 Start Initialization
function waitForYouTubeAPI(callback) {
    if (window.YT && window.YT.Player) {
        callback();
    } else {
        console.warn("⏳ Waiting for YouTube API...");
        setTimeout(() => waitForYouTubeAPI(callback), 500);
    }
}

function initialize() {
    waitForYouTubeAPI(() => {
        onYouTubeIframeAPIReady();
    });
}

let isLooping = false; // Variable to track loop state

// 🔹 Toggle Loop for Current Song (loop-single button)
if (document.getElementById('loop-single')) {
    const loopButton = document.getElementById('loop-single');
    
    loopButton.addEventListener('click', () => {
        isLooping = !isLooping;
        console.log(isLooping ? "🔁 Looping enabled" : "➡️ Looping disabled");

        // Toggle active-mode class for visual feedback
        loopButton.classList.toggle('active-mode', isLooping);

        // Manually handle looping
        // YouTube API doesn't support setLoop(), we handle it ourselves on state change
    });
}

// 🔹 Handle Player State Change for Looping
function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            if (isLooping) {
                player.loadVideoById(playlist[currentSongIndex].id); // Reload the same song if looping is enabled
                player.playVideo(); // Play again
            } else {
                playSong(currentSongIndex + 1); // Go to the next song if looping is disabled
            }
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

let notificationTimeout;

function showNowPlayingNotification(title) {
    if (Notification.permission !== "granted") return;

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        new Notification("🎶 Now Playing", {
            body: title,
            icon: "logo.png"
        });
    }, 300); // waits 300ms before showing
}

// Start the initialization
initialize();