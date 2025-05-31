// 🎵playlist Data (Multiple Streams)
let playlist= [
    { id: "jfKfPfyJRdk", title: "lofi hip hop radio 📚 beats to relax/study to" },
    { id: "5yx6BWlEVcY", title: "Chillhop Radio - jazzy & lofi hip hop beats 🐾" },
    { id: "HuFYqnbVbzY", title: "jazz lofi radio 🎷 beats to chill/study to" },
    { id: "dw_Bx0e0lis", title: "Honey Coffee ☕ Sweet Day with Lofi Cafe in Forest 🍯 Lofi Hip Hop for relax, work, study 24/7" },
    { id: "IxPANmjPaek", title: "medieval lofi radio 🏰 - beats to scribe manuscripts to" },
    { id: "nPqLRmvyG2I", title: "no copyright lofi jazz music 🎷 relax/study beats 24/7" },
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

document.getElementById("submitVibe").addEventListener("click", async () => {
  const vibeText = document.getElementById("vibeInput").value.trim();
  const vibeName = document.getElementById("vibeName").value.trim() || "Anonymous";

  if (!vibeText) {
    alert("Please write your vibe before submitting!");
    return;
  }

  try {
    await fetch("https://script.google.com/macros/s/AKfycbwVrmlYmI3MUGa7Ip6LzVyrKIw041sZa37F0vQJ4ec-Lw0d0bQiaSKfEdH2PdKoFyGl7w/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vibe: vibeText, name: vibeName })
    });

    alert(`Thanks for your vibe, ${vibeName}!\n\n"${vibeText}"`);
  } catch (error) {
    alert("Oops! Something went wrong. Try again later.");
    console.error(error);
    return;
  }

  document.getElementById("vibeInput").value = "";
  document.getElementById("vibeName").value = "";
  document.getElementById("vibePopup").classList.add("hidden");

  loadVibes(); // Refresh the list if displayed on the page
});