// 🎵playlist Data (Multiple Streams)
let playlist= [
    { id: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 beats to relax/study to" },
    { id: "5yx6BWlEVcY", title: "Chillhop Radio - jazzy & lofi hip hop beats 🐾" },
    { id: "HuFYqnbVbzY", title: "jazz lofi radio 🎷 beats to chill/study to" },
    { id: "dw_Bx0e0lis", title: "Honey Coffee ☕ Sweet Day with Lofi Cafe in Forest 🍯 Lofi Hip Hop for relax, work, study 24/7" },
    { id: "IxPANmjPaek", title: "medieval lofi radio 🏰 - beats to scribe manuscripts to" },
    { id: "nPqLRmvyG2I", title: "no copyright lofi jazz music 🎷 relax/study beats 24/7" },
    { id: "28KRPhVzCus", title: "lofi hip hop radio 💤 beats to sleep/chill to" },
    { id: "P6Segk8cr-c", title: "sad lofi radio ☔ beats for rainy days" },
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
    const vinyl = document.querySelector('.vinyl');
    if (!vinyl) return;

    if (isPlaying) {
        vinyl.classList.add('spinning');
        vinyl.classList.add('pulsing');
    } else {
        vinyl.classList.remove('spinning');
        vinyl.classList.remove('pulsing');
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

// 🔥 Spacebar Play/Pause Toggle 🔥
document.addEventListener("keydown", (event) => {
    // Check if spacebar is pressed and no input is focused (so you don't mess up typing)
    if (event.code === "Space" && 
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault(); // Prevent page scrolling on spacebar

        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        isPlaying = !isPlaying;
        startVinylAnimation();
    }
});

document.addEventListener('click', e => {
  for (let i = 0; i < 8; i++) {  // Number of flecks per click
    const fleck = document.createElement('div');
    fleck.classList.add('particle');
    document.body.appendChild(fleck);

    // Set fleck start position (cursor)
    fleck.style.left = e.clientX + 'px';
    fleck.style.top = e.clientY + 'px';

    // Random direction and distance
    const angle = Math.random() * 2 * Math.PI;
    const distance = 40 + Math.random() * 20;
    fleck.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    fleck.style.setProperty('--y', `${Math.sin(angle) * distance}px`);

    // Remove fleck after animation finishes
    fleck.addEventListener('animationend', () => {
      fleck.remove();
    });
  }
});

const volumeSlider = document.getElementById("volume-slider");
const volumePercent = document.getElementById("volume-percent");

function updateVolumeDisplay() {
  const volume = parseInt(volumeSlider.value, 10);
  volumePercent.textContent = `${volume}%`;

  // If using YouTube IFrame API
  if (player && typeof player.setVolume === "function") {
    player.setVolume(volume);
  }
}

// Initialize display
updateVolumeDisplay();

// Update on input
volumeSlider.addEventListener("input", updateVolumeDisplay);

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


document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        isPlaying ? player.pauseVideo() : player.playVideo();
        isPlaying = !isPlaying;
        startVinylAnimation();
    }
});
const playButton = document.getElementById("play");

function togglePlayPause() {
  const isPlaying = player.getPlayerState && player.getPlayerState() === 1;

  if (isPlaying) {
    player.pauseVideo();
    playButton.textContent = "▶️ Paused";
    playButton.classList.remove("playing");
  } else {
    player.playVideo();
    playButton.textContent = "⏸️ Playing...";
    playButton.classList.add("playing");
  }
}

playButton.addEventListener("click", togglePlayPause);

// Replace with your real API key (KEEP THIS PRIVATE in real apps!)
const YOUTUBE_API_KEY = 'AIzaSyD1uj92u2HMWDm9RDyLrWyPyfPa2kZN_k0';

// Reference to the <span> element in your HTML where listener count is shown
const listenerCountSpan = document.getElementById("listener-count");

function fetchListenerCount(videoId) {
  if (!videoId || !listenerCountSpan) return;

  fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const count = data.items?.[0]?.liveStreamingDetails?.concurrentViewers;
      listenerCountSpan.textContent = count ? `👀 ${count} listeners` : '👀 Live info not available';
    })
    .catch(() => {
      listenerCountSpan.textContent = '👀 Error loading listeners';
    });
}