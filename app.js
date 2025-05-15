let playlist = [
    { id: "xakBzg5atsM", title: "massobeats - rose water (royalty free lofi music)", moods: ["chill", "relax"] },
    { id: "HGMQbVfYVmI", title: "massobeats - honey jam (royalty free lofi music)", moods: ["study", "focus", "chill"] },
    { id: "6eWIffP2M3Y", title: "Jazz Type Beat - 'Bread' | Royalty Free Music | Prod. by Lukrembo", moods: ["study", "calm"] },
    { id: "KGQNrzqrGqw", title: "Lofi Type Beat - 'Onion' | Prod. by Lukrembo", moods: ["chill", "relax"] },
    { id: "tEzzsT4qsbU", title: "massobeats - lucid (royalty free lofi music)", moods: ["calm", "focus"] },
    { id: "y7KYdqVND4o", title: "lukrembo - marshmallow (royalty free vlog music)", moods: ["chill"] },
    { id: "O8MYZY6sFpI", title: "animal crossing ~ new horizons lofi", moods: ["chill", "relax"] },
    { id: "1P5BSm_oFJg", title: "Lofi Girl - Snowman (Music Video)", moods: ["relax", "calm"] },
    { id: "gv7hcXCnjOw", title: "(no copyright music) jazz type beat “sunset” | royalty free vlog music | prod. by lukrembo", moods: ["chill", "study"] },
    { id: "YTUF1o9Sf3E", title:"lukrembo - affogato (royalty free vlog music)", moods: ["chill"] },
    { id: "EtZ2m2Zm3vY", title:"(no copyright music) lofi type beat “biscuit” | free vlog music | prod. by lukrembo", moods: ["relax", "calm"] }
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

// 🔹 Load YouTube IFrame API with a Delay (Fixes Safari Issues)
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => setTimeout(resolve, 500); // Delay to ensure full load
        script.onerror = () => reject("Error loading YouTube API");
        document.head.appendChild(script);
    });
}

// 🔹 Initialize YouTube Player
async function initialize() {
    try {
        await loadYouTubeAPI();
        ensureYouTubeAPIReady();
    } catch (error) {
        console.error(error);
    }
}

// 🔹 Ensure YouTube API is Ready (Fix for Safari)
function ensureYouTubeAPIReady() {
    if (typeof YT !== "undefined" && YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        console.warn("⏳ Waiting for YouTube API to load...");
        setTimeout(ensureYouTubeAPIReady, 500);
    }
}

// 🔹 YouTube API Callback
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '390',
        width: '640',
        videoId: playlist[currentSongIndex].id,
        playerVars: {
            autoplay: 0, // Prevent Safari autoplay block
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
        listItem.style.cursor = "pointer";

        listItem.addEventListener("click", (event) => {
            let clickedIndex = parseInt(event.currentTarget.dataset.index, 10);
            playSong(clickedIndex);
        });

        elements.queueList.appendChild(listItem);
    });
}

// 🔹 Update Song Info
function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
}

// 🔹 Play Song with Autoplay Handling
function playSong(index, skippedCount = 0) {
    if (index >= playlist.length) index = 0;
    if (index < 0) index = playlist.length - 1;

    if (skippedCount >= playlist.length) {
        console.error("No valid videos found in the playlist.");
        return;
    }

    currentSongIndex = index;
    let videoId = playlist[currentSongIndex].id;

    if (!videoId || videoId.length < 10) {
        console.warn(`Skipping invalid video: ${playlist[currentSongIndex].title}`);
        playSong(index + 1, skippedCount + 1);
        return;
    }

    player.loadVideoById(videoId);

    // 🛠 Fix Safari Autoplay Issue
    setTimeout(() => {
        if (isPlaying) {
            player.playVideo();
        }
    }, 500);

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
        isPlaying = !isPlaying;
        startVinylAnimation();
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

// 🔹 Vinyl Record Animation
function startVinylAnimation() {
    if (elements.vinylRecord) {
        setTimeout(() => {
            elements.vinylRecord.classList.toggle("spinning", isPlaying);
            elements.vinylRecord.classList.toggle("pulsing", isPlaying);
        }, 100);
        console.log("🎵 Vinyl animation updated:", elements.vinylRecord.classList);
    }
}

// 🔹 Fix for Safari Background Playback
document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) {
        console.log("🔇 Page hidden, keeping music playing...");
        player.playVideo(); // Ensures music keeps playing
    } else {
        console.log("🎵 Page visible, continuing playback...");
    }
});
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
if ("Notification" in window) {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
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

// 🔹 Start Initialization
initialize();