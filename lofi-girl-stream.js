// 🎵playlist Data (Multiple Streams)
let playlist= [
    { id: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 beats to relax/study to" },
    { id: "5yx6BWlEVcY", title: "Chillhop Radio - jazzy & lofi hip hop beats 🐾" },
    { id: "pHoADRY_WSM", title: "Espresso Coffee 🍵 Coffee Shop Lofi 🌴 Beats for work / relax [ lofi hip hop ~ lofi cafe ]" },
    { id: "dw_Bx0e0lis", title: "Honey Coffee ☕ Sweet Day with Lofi Cafe in Forest 🍯 Lofi Hip Hop for relax, work, study 24/7" },
];

let currentSongIndex = 0;
let isPlaying = false;
let playerReady = false; // ✅ Track player readiness
let retryCount = 0;
const maxRetries = 10;

// 🎛️ UI Elements
const elements = {
    playerContainer: document.getElementById("player-container"),
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.createElement("button"),
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title"),
};

// 🎵 Create & Style "Next" Button
elements.nextButton.textContent = "Next";
elements.nextButton.id = "next";
elements.nextButton.style.marginLeft = "10px"; 

// Insert "Next" button **right after** the "Play" button
elements.playButton.parentNode.insertBefore(elements.nextButton, elements.playButton.nextSibling);

// 🎵 YouTube Player API Initialization
let player;
function onYouTubeIframeAPIReady() {
    if (player) {
        console.warn("🎵 Player already initialized. Skipping reinitialization.");
        return;
    }

    console.log(`🎵 Loading YouTube API...`);

    player = new YT.Player("youtube-player", {
        height: "390",
        width: "640",
        videoId: playlist[currentSongIndex].id,
        playerVars: { autoplay: 0, controls: 1, modestbranding: 1, showinfo: 1 },
        events: {
            onReady: onPlayerReady,
            onStateChange: handlePlayerStateChange
        }
    });

    updateQueue();
}

// ✅ Ensure Player is Ready Before Playing
function onPlayerReady(event) {
    console.log("✅ Player is ready!");
    playerReady = true; // ✅ Mark player as ready
    retryCount = 0; // Reset retry count when player becomes ready
    updateSongInfo();
}

// ✅ Function to Play Songs (Fixed)
function playSong(index) {
    if (!playerReady || !player || typeof player.loadVideoById !== "function") {
        console.warn(`⏳ Player not ready. Retrying in 500ms... (${retryCount + 1}/${maxRetries})`);
        if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => playSong(index), 500);
        } else {
            console.error("❌ Max retries reached. Player is still not ready.");
        }
        return;
    }

    retryCount = 0; // Reset retry count on success
    currentSongIndex = index;

    console.log(`🎶 Switching to: ${playlist[currentSongIndex].title}`);

    // Load new video (No need to stop the previous one)
    player.cueVideoById(playlist[currentSongIndex].id);

    // Wait a bit, then try playing
    setTimeout(() => {
        if (playerReady && player.getPlayerState() !== YT.PlayerState.PLAYING) {
            player.playVideo();
            isPlaying = true;
        }
    }, 800); // ⏳ Increased delay to ensure smooth playback

    updateSongInfo();
    startVinylAnimation();
}

// 🎵 Play or Pause
function togglePlayPause() {
    if (!playerReady || !player || typeof player.getPlayerState !== "function") {
        console.error("❌ Player is not ready yet.");
        return;
    }

    const playerState = player.getPlayerState();

    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        isPlaying = false;
    } else {
        player.playVideo();
        isPlaying = true;
    }

    startVinylAnimation();
}

// ⏭ Play Next Song
function playNext() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSong(currentSongIndex);
}

// 🎧 Update Now Playing Title
function updateSongInfo() {
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
            updateSongInfo();
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

// 🎶 Update Queue Display
function updateQueue() {
    elements.queueList.innerHTML = ""; 
    playlist.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.style.cursor = "pointer";
        listItem.addEventListener("click", () => playSong(index));
        elements.queueList.appendChild(listItem);
    });
}

// 🎵 Start Vinyl Record Animation
function startVinylAnimation() {
    if (elements.vinylRecord) {
        elements.vinylRecord.classList.toggle("spinning", isPlaying);
    }
}

// 🚀 Initialize Function
function initialize() {
    console.log("🚀 Initializing App...");
    updateQueue();
    updateSongInfo();

    if (typeof YT === "undefined" || !YT.Player) {
        console.warn("⏳ Waiting for YouTube API...");
        setTimeout(initialize, 500);
    } else {
        console.log("✅ YouTube API detected! Initializing player...");
        onYouTubeIframeAPIReady();
    }
}

// 🚀 Initialize
initialize();
setTimeout(() => {
    if (!player || !player.getIframe()) {
        console.warn("🔄 Player is not loading correctly. Reloading...");
        location.reload();
    }
}, 2000); // Wait 2 seconds before checking
elements.playButton.addEventListener("click", togglePlayPause);
elements.nextButton.addEventListener("click", playNext);
window.addEventListener("resize", () => {
    console.log("🔄 Resized: Checking if player is broken...");
    if (!player || !player.getIframe()) {
        console.warn("🚀 Fixing broken player...");
        onYouTubeIframeAPIReady();
    }
});
console.log("YouTube Iframe API Ready Function Loaded!");

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

const canvas = document.getElementById("visualizer");
const ctx = canvas?.getContext("2d");

function drawVisualizerFake() {
    if (!isPlaying || !player || !player.getCurrentTime) {
        requestAnimationFrame(drawVisualizerFake);
        return;
    }

    const time = player.getCurrentTime();
    const bars = 40;
    const barWidth = canvas.width / bars;
    const heightFactor = Math.sin(time * 2) + 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bars; i++) {
        const height = Math.sin(i + time * 4) * 20 * heightFactor + 30;
        ctx.fillStyle = `hsl(${(i * 10 + time * 50) % 360}, 70%, 60%)`;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
    }

    requestAnimationFrame(drawVisualizerFake);
}

drawVisualizerFake();
