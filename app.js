// 🎵 List of YouTube Video IDs & Titles
const songQueue = [
    { id: "xakBzg5atsM", title: "massobeats - rose water (royalty free lofi music)" },
    { id: "HGMQbVfYVmI", title: "massobeats - honey jam (royalty free lofi music)" },
    { id: "6eWIffP2M3Y", title: "(no copyright music) jazz type beat “bread” | royalty free youtube music | prod. by lukrembo)" },
    { id: "KGQNrzqrGqw", title: "(no copyright music) lofi type beat “onion” | prod. by lukrembo)" },
    { id: "y7KYdqVND4o", title: "lukrembo - marshmallow (royalty free vlog music)" }
];

// 🎧 HTML Elements
const playerContainer = document.getElementById("player-container");
const queueList = document.getElementById("queue");
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const vinylRecord = document.getElementById("vinyl");
const songTitle = document.getElementById("song-title");
const progressBar = document.getElementById("progress-bar");
const progressContainer = progressBar.parentElement;
const timeRemaining = document.getElementById("time-remaining");

let currentSongIndex = 0;
let isPlaying = false;
let player;
let updateInterval;

// 🔹 Looping Flags
let loopSingleSong = false;  // 🔄 Toggle for looping a single song
let loopPlaylist = false;    // 🔄 Toggle for looping the entire playlist

// 🔹 Loop Button Event Listeners
const loopSingleButton = document.getElementById("loop-single");
const loopPlaylistButton = document.getElementById("loop-playlist");

loopSingleButton.addEventListener("click", () => {
    loopSingleSong = !loopSingleSong; // Toggle single song loop
    loopPlaylist = false; // Disable playlist loop when switching to single song loop
    toggleActiveMode('loop-single', loopSingleSong);
    toggleActiveMode('loop-playlist', false);
});

loopPlaylistButton.addEventListener("click", () => {
    loopPlaylist = !loopPlaylist; // Toggle playlist loop
    loopSingleSong = false; // Disable single song loop when switching to playlist loop
    toggleActiveMode('loop-playlist', loopPlaylist);
    toggleActiveMode('loop-single', false);
});

// 🔹 Load YouTube IFrame API
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: songQueue[currentSongIndex].id, // Load the first song immediately
        playerVars: { autoplay: 0, controls: 0 },
        events: {
            onReady: () => {
                loadQueue();
                updateSongInfo(); // Ensure the first song's info is displayed
            },
            onStateChange: onPlayerStateChange
        }
    });
}

// 🔹 Load the queue
function loadQueue() {
    queueList.innerHTML = "";
    songQueue.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.addEventListener("click", () => playSong(index));
        queueList.appendChild(listItem);
    });
}

// 🔹 Update song title
function updateSongInfo() {
    songTitle.textContent = songQueue[currentSongIndex].title;
}

// 🔹 Play a song from the queue
function playSong(index) {
    if (index >= songQueue.length) index = 0; // Loop back to first song
    currentSongIndex = index;
    player.loadVideoById(songQueue[currentSongIndex].id);
    player.playVideo();
    updateSongInfo();
    isPlaying = true;
    progressBar.style.width = "0%"; // Reset progress bar to 0% on song change
    updateVinylAnimation();
}

// 🔹 Play/Pause button
playButton.addEventListener("click", () => {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

// 🔹 Skip song button
nextButton.addEventListener("click", () => {
    playSong(currentSongIndex + 1);
});

// 🔹 Auto-play next song when current ends
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        if (loopSingleSong) {
            playSong(currentSongIndex); // 🔁 Replay the same song
        } else if (loopPlaylist) {
            playSong(0); // 🔁 Loop the entire playlist from the start
        } else {
            playSong(currentSongIndex + 1); // ▶️ Move to the next song
        }
    } else if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        startUpdatingTime();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
    }
    updateVinylAnimation();
}

// 🔹 Update vinyl record animation
function updateVinylAnimation() {
    if (isPlaying) {
        vinylRecord.classList.add("spinning");
    } else {
        vinylRecord.classList.remove("spinning");
    }
}

// 🔹 Update progress bar & time remaining
function updateTime() {
    if (!player || !player.getDuration) return;

    let duration = player.getDuration();
    let currentTime = player.getCurrentTime();
    let remainingTime = duration - currentTime;

    // Update progress bar width
    progressBar.style.width = (currentTime / duration) * 100 + "%";

    // Format time display (mm:ss)
    let minutes = Math.floor(remainingTime / 60);
    let seconds = Math.floor(remainingTime % 60);
    timeRemaining.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// 🔹 Start updating time every second
function startUpdatingTime() {
    clearInterval(updateInterval); // Clear previous interval to prevent duplicates
    updateInterval = setInterval(() => {
        if (isPlaying) updateTime();
    }, 1000);
}

// 🔹 Seek functionality: Click on progress bar to skip to part of song
progressContainer.addEventListener("click", (event) => {
    if (!player || !player.getDuration) return;

    let barWidth = progressContainer.clientWidth;
    let clickPosition = event.offsetX;
    let seekTo = (clickPosition / barWidth) * player.getDuration();
    
    player.seekTo(seekTo, true);
    updateTime(); // Update immediately so progress bar doesn't lag
});

// 🔹 Toggle active state for buttons
function toggleActiveMode(buttonId, setActive = true) {
    const button = document.getElementById(buttonId);
    if (setActive) {
        button.classList.add('active-mode');
    } else {
        button.classList.remove('active-mode');
    }
}

// 🔹 Load YouTube API Script
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);