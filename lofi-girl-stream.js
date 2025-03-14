// 🎵 Playlist Data (Multiple Streams)
let playlist = [
    { id: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 beats to relax/study to" },
    { id: "5yx6BWlEVcY", title: "Chillhop Radio - jazzy & lofi hip hop beats 🐾" },
    { id: "pHoADRY_WSM", title: "Espresso Coffee 🍵 Coffee Shop Lofi 🌴 Beats for work / relax [ lofi hip hop ~ lofi cafe ]" }
];

let currentSongIndex = 0;
let isPlaying = false; // Keeps track of playback state

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
elements.nextButton.style.marginLeft = "10px"; // Add spacing

// Insert "Next" button **right after** the "Play" button
elements.playButton.parentNode.insertBefore(elements.nextButton, elements.playButton.nextSibling);

// 🎵 YouTube Player API Initialization
let player;
function onYouTubeIframeAPIReady() {
    console.log(`🎵 Loading: ${playlist[currentSongIndex].title}`);

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

// ✅ Function to Play Live Streams Properly
function playSong(index) {
    if (!player || !player.loadVideoById) {
        console.error("❌ Player not initialized yet.");
        return;
    }
    
    currentSongIndex = index;
    player.loadVideoById(playlist[currentSongIndex].id);
    
    // 🔥 Explicitly play the video to fix live stream playback
    setTimeout(() => {
        player.playVideo();
    }, 500);

    updateSongInfo();
    startVinylAnimation();
}

// 🎵 Play or Pause
function togglePlayPause() {
    if (!player) return;

    const playerState = player.getPlayerState();

    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        isPlaying = false;
    } else {
        player.playVideo();
        isPlaying = true;
    }
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
    elements.queueList.innerHTML = ""; // Clear previous list
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

// 🚀 Initialize Function (Fixes the missing `initialize()` call)
function initialize() {
    updateQueue();
    updateSongInfo();
}

// 🚀 Initialize
initialize();
elements.playButton.addEventListener("click", togglePlayPause);
elements.nextButton.addEventListener("click", playNext);