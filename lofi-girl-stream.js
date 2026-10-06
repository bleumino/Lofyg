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
    { id: "Na0w3Mz46GA", title: "asian lofi radio ⛩️ beats to relax/study to" },
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
    startVinylAnimation();
    syncPlayButton();
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
// (removed: reloading the page after 2s broke slow connections; initialize() already retries until the API is ready)
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
    if (elements.vinylRecord) elements.vinylRecord.classList.toggle("playing", isPlaying);
}

// Space bar toggles play/pause (unless you're typing, or a button/link has keyboard focus)
document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(document.activeElement.tagName)) return;
    event.preventDefault();
    togglePlayPause();
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


const playButton = document.getElementById("play");

function togglePlayPause() {
  // Ask the player what it is doing instead of keeping our own flag (the flag drifts out of sync)
  if (!player || typeof player.getPlayerState !== "function") return;
  if (player.getPlayerState() === 1) player.pauseVideo();   // 1 = playing
  else player.playVideo();
}

// Keep the Play button label in step with the real player state
function syncPlayButton() {
  const btn = document.getElementById("play");
  if (!btn) return;
  btn.textContent = isPlaying ? "⏸️ Playing..." : "▶️ Paused";
  btn.classList.toggle("playing", isPlaying);
}

playButton.addEventListener("click", togglePlayPause);

const vinyl = document.getElementById('vinyl');

vinyl.addEventListener('click', () => {
    vinyl.classList.add('clicked');

    // Remove the class after animation so it can repeat
    setTimeout(() => {
        vinyl.classList.remove('clicked');
    }, 400); // match the animation duration
});


// Chat feature with random affirmations
const affirmations = [
  // soft affirmations
  "you’re doing okay",
  "take your time, no rush",
  "it’s fine to slow down",
  "you don’t need to do everything today",
  "rest counts",
  "one thing at a time",
  "you’re allowed to just exist for a bit",
  "this is enough for now",
  "be gentle with yourself",
  "you’re not behind",
  "small steps are progress",
  "you’re allowed to pause",
  "it’s okay to not be productive",

  // stream / music reactions
  "this beat is really nice",
  "this one feels calm",
  "perfect background music",
  "this helps me focus a lot",
  "i like this track",
  "this is cozy",
  "good vibes tonight",
  "this feels peaceful",
  "this is exactly what i needed",
  "lofi always hits",
  "the rain sounds are soothing",
  "the vinyl crackle is comforting",
  "this mix is fire",

  // casual human chat
  "anyone else studying?",
  "late night gang",
  "been looping this for a while",
  "rainy vibes even without rain",
  "headphones on, world off",
  "working but not rushing",
  "quiet hours are the best",
  "this makes the room feel warmer",
  "time feels slower here",
  "just here to vibe",
  "this helps me unwind",
  "I could listen to this forever",
  "this is my happy place",

  // gentle encouragement
  "keep going, you’ve got this",
  "even small progress matters",
  "you showed up today",
  "it’s okay if today was messy",
  "tomorrow can wait",
  "you’re doing better than you think",
  "slow progress is still progress",
  "you’re allowed to take breaks",
  "your effort counts",
  "you’re enough as you are",
  "this moment is yours",
  "you’re allowed to rest",
  "be proud of how far you’ve come",

  // very human, very real
  "not sure who needs this but you’re fine",
  "it’s okay to feel tired",
  "no pressure, just vibes",
  "sometimes doing nothing helps",
  "this stream feels safe",
  "I like being here",
  "this helps my brain chill",
  "just needed to say that",
  "I’m glad this exists",
  "this is a good space",
  "feels nice to just be here",
  "Home Depot is way Better Than Loes",
  "​lia that's great I know a lot Bangladeshi ppl here🤩",
  "dirty here? why did he block me bro",
  "​​bro is having mixed feelings for tool valid after our argument", 
  "It's 2am here",
  "It's 11:30pm and I'm studying for my finals",
];

const usernames = [
  // simple, real-feeling
  "alex",
  "sam_here",
  "jordanl",
  "mike27",
  "emily_r",
  "​lia",
  "danielx",
  "lucas99",
  "miaaa",
  "noah_w",
  "chris_t",
  "sarah.k",
  "taylors",

  // study / late night realism
  "studyingrn",
  "cant_sleep",
  "up_too_late",
  "trying_to_focus",
  "almost_asleep",
  "one_more_hour",
  "brainfog",
  "deadline_soon",
  "still_working",

  // casual + imperfect
  "idkman",
  "justvibing",
  "hereagain",
  "probably_me",
  "uhh_hi",
  "okokok",
  "whateverlol",
  "tired_today",
  "sameasalways",

  // lofi-adjacent but subtle
  "softnoise",
  "lowvolume",
  "rain_loop",
  "lateplaylist",
  "quietroom",
  "windowopen",
  "headphoneson",

  // very YouTube-chat coded
  "user_48291",
  "guest123",
  "anonymous",
  "someone_here",
  "watching_this",
  "listening_now",
  "just_joined",
  "Bleumino",
  "ChatMaster",
  "VibeSeeker",
  "Meraki_Moon1",

  // slightly quirky but still normal
  "catonkeyboard",
  "coffee_spilled",
  "missed_the_bus",
  "sleep_schedule",
  "notes_everywhere",
  "lamp_is_on",
  "blanketfort",
  "deskplants",
  "windowseat"

];

const name = usernames[Math.floor(Math.random() * usernames.length)];
const message = `${name}: ${affirmations}`;

// --- Floating Affirmation Chat ---
const chatList = document.getElementById('chat-messages');

function addFloatingMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;

  chatList.appendChild(li);

  // Remove after animation completes (5s)
  setTimeout(() => li.remove(), 5000);

  // Optional: auto-scroll (if chat overflows)
  chatList.scrollTop = chatList.scrollHeight;
}

// Send a message every 5–10 seconds
setInterval(() => {
  const randomName = usernames[Math.floor(Math.random() * usernames.length)];
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
  const randomMsg = `${randomName}: ${randomAffirmation}`;
  addFloatingMessage(randomMsg);
}, Math.floor(Math.random() * 5000) + 5000); // random 5–10s

const viewers = document.getElementById('viewers-count');
const hearts = document.getElementById('hearts-count');

setInterval(() => {
  viewers.textContent = `👀 ${Math.floor(1000 + Math.random()*5000)}`;
  hearts.textContent = `❤️ ${Math.floor(100 + Math.random()*1000)}`;
}, 5000);