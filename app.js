let playlist = [
    { id: "xakBzg5atsM", title: "massobeats - rose water (royalty free lofi music)", moods: ["chill", "relax", "all"] },
    { id: "HGMQbVfYVmI", title: "massobeats - honey jam (royalty free lofi music)", moods: ["study", "focus", "chill", "all"] },
    { id: "6eWIffP2M3Y", title: "Jazz Type Beat - 'Bread' | Royalty Free Music | Prod. by Lukrembo", moods: ["study", "calm", "all"] },
    { id: "KGQNrzqrGqw", title: "Lofi Type Beat - 'Onion' | Prod. by Lukrembo", moods: ["chill", "relax","all"] },
    { id: "tEzzsT4qsbU", title: "massobeats - lucid (royalty free lofi music)", moods: ["calm", "focus","all"] },
    { id: "y7KYdqVND4o", title: "lukrembo - marshmallow (royalty free vlog music)", moods: ["chill","all"] },
    { id: "O8MYZY6sFpI", title: "animal crossing ~ new horizons lofi", moods: ["chill", "relax","all"] },
    { id: "1P5BSm_oFJg", title: "Lofi Girl - Snowman (Music Video)", moods: ["relax", "calm","all"] },
    { id: "gv7hcXCnjOw", title: "(no copyright music) jazz type beat “sunset” | royalty free vlog music | prod. by lukrembo", moods: ["chill", "study","all"] },
    { id: "YTUF1o9Sf3E", title:"lukrembo - affogato (royalty free vlog music)", moods: ["chill"] },
    { id: "EtZ2m2Zm3vY", title:"(no copyright music) lofi type beat “biscuit” | free vlog music | prod. by lukrembo", moods: ["relax", "calm", "all"] }
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
let filteredPlaylist = [...playlist]; // current playlist based on mood filter

// 🔹 Load YouTube IFrame API with a Delay (Fixes Safari Issues)
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => setTimeout(resolve, 500);
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
        videoId: filteredPlaylist[currentSongIndex].id,
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
                loadQueue(filteredPlaylist);
                updateSongInfo();
                setupMoodButtons();
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}

// 🔹 Load Queue List with playlist argument
function loadQueue(currentList = filteredPlaylist) {
    elements.queueList.innerHTML = "";
    currentList.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.style.cursor = "pointer";

        listItem.addEventListener("click", (event) => {
            let clickedIndex = parseInt(event.currentTarget.dataset.index, 10);
            playSong(clickedIndex, currentList);
        });

        elements.queueList.appendChild(listItem);
    });
}

// 🔹 Update Song Info
function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${filteredPlaylist[currentSongIndex].title}`;
}

// 🔹 Play Song with playlist argument
function playSong(index, currentList = filteredPlaylist, skippedCount = 0) {
    if (index >= currentList.length) index = 0;
    if (index < 0) index = currentList.length - 1;

    if (skippedCount >= currentList.length) {
        console.error("No valid videos found in the playlist.");
        return;
    }

    currentSongIndex = index;
    let videoId = currentList[currentSongIndex].id;

    if (!videoId || videoId.length < 10) {
        console.warn(`Skipping invalid video: ${currentList[currentSongIndex].title}`);
        playSong(index + 1, currentList, skippedCount + 1);
        return;
    }

    player.loadVideoById(videoId);

    setTimeout(() => {
        if (isPlaying) {
            player.playVideo();
        }
    }, 500);

    elements.songTitle.textContent = `Now Playing: ${currentList[currentSongIndex].title}`;
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
        playSong(currentSongIndex + 1, filteredPlaylist);
    });
}

// 🔹 Handle Player State Change with loop support
let isLooping = false;

function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            if (isLooping) {
                player.loadVideoById(filteredPlaylist[currentSongIndex].id);
                player.playVideo();
            } else {
                playSong(currentSongIndex + 1, filteredPlaylist);
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

// 🔹 Handle YouTube API Errors
function handlePlayerError(event) {
    console.error(`YouTube Player Error: ${event.data}`);
    console.warn(`Skipping broken video: ${filteredPlaylist[currentSongIndex].title}`);
    playSong(currentSongIndex + 1, filteredPlaylist);
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
        player.playVideo();
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

// 🔹 Toggle Loop Button
if (document.getElementById('loop-single')) {
    const loopButton = document.getElementById('loop-single');
    loopButton.addEventListener('click', () => {
        isLooping = !isLooping;
        loopButton.classList.toggle('active-mode', isLooping);
        console.log(isLooping ? "🔁 Loop enabled" : "➡️ Loop disabled");
    });
}

// 🔹 Setup Mood Buttons
function setupMoodButtons() {
    const moodButtons = document.querySelectorAll("#mood-selector button");

    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons
            moodButtons.forEach(btn => btn