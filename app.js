// 🎵 Playlist Data (Updated)
let playlist = [
    { id: "xakBzg5atsM", title: "massobeats - rose water (royalty free lofi music)" },
    { id: "HGMQbVfYVmI", title: "massobeats - honey jam (royalty free lofi music)" },
    { id: "6eWIffP2M3Y", title: "Jazz Type Beat - 'Bread' | Royalty Free Music | Prod. by Lukrembo" },
    { id: "KGQNrzqrGqw", title: "Lofi Type Beat - 'Onion' | Prod. by Lukrembo" },
    { id: "tEzzsT4qsbU", title: "massobeats - lucid (royalty free lofi music)" },
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
    progressContainer: document.getElementById("progress-bar")?.parentElement,
    timeRemaining: document.getElementById("time-remaining"),
    loopSingleButton: document.getElementById("loop-single"),
    loopPlaylistButton: document.getElementById("loop-playlist")
};

let currentSongIndex = 0;
let isPlaying = false;
let player;
let updateInterval;

// 🔹 Looping Flags
let loopSingleSong = false;
let loopPlaylist = false;

// 🔹 Loop Button Event Listeners (Only if Buttons Exist)
if (elements.loopSingleButton) {
    elements.loopSingleButton.addEventListener("click", () => {
        loopSingleSong = !loopSingleSong;
        loopPlaylist = false;
        toggleActiveMode("loop-single", loopSingleSong);
        toggleActiveMode("loop-playlist", false);
    });
}

if (elements.loopPlaylistButton) {
    elements.loopPlaylistButton.addEventListener("click", () => {
        loopPlaylist = !loopPlaylist;
        loopSingleSong = false;
        toggleActiveMode("loop-playlist", loopPlaylist);
        toggleActiveMode("loop-single", false);
    });
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
    player = new YT.Player("youtube-player", {
        height: "390",
        width: "640",
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
    if (!elements.queueList) return;
    
    elements.queueList.innerHTML = "";
    playlist.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;

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

// 🔹 Play Song with Error Handling
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

// 🔹 Update Vinyl Record Animation
function startVinylAnimation() {
    if (elements.vinylRecord) {
        if (isPlaying) {
            elements.vinylRecord.classList.add("spinning");
        } else {
            elements.vinylRecord.classList.remove("spinning");
        }
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

// 🔹 Start Initialization
initialize();