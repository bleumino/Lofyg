// Your playlist data
let playlist = [
    { id: "xakBzg5atsM", title: "massobeats - rose water", moods: ["chill", "relax"] },
    { id: "HGMQbVfYVmI", title: "massobeats - honey jam", moods: ["study", "focus",] },
    { id: "6eWIffP2M3Y", title: "Jazz Type Beat - Bread", moods: ["study",] },
    { id: "KGQNrzqrGqw", title: "Lofi Type Beat - Onion", moods: ["chill", "relax"] },
    { id: "tEzzsT4qsbU", title: "massobeats - lucid", moods: ["calm", "focus"] },
    { id: "y7KYdqVND4o", title: "lukrembo - marshmallow", moods: ["chill"] },
    { id: "O8MYZY6sFpI", title: "animal crossing lofi", moods: ["chill", "relax"] },
    { id: "1P5BSm_oFJg", title: "Lofi Girl - Snowman", moods: ["relax"] },
    { id: "gv7hcXCnjOw", title: "Jazz Type Beat – Sunset", moods: ["chill", "study"] },
    { id: "YTUF1o9Sf3E", title: "lukrembo - affogato", moods: ["chill"] },
    { id: "EtZ2m2Zm3vY", title: "lofi type beat – biscuit", moods: ["relax"] }
];

let currentPlaylist = [...playlist];
let currentSongIndex = 0;
let isPlaying = false;
let isLooping = false;
let updateInterval;
let player;
let notificationTimeout;

if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

const elements = {
    queueList: document.getElementById("queue"),
    playButton: document.getElementById("play"),
    nextButton: document.getElementById("next"),
    vinylRecord: document.getElementById("vinyl"),
    songTitle: document.getElementById("song-title"),
    progressBar: document.getElementById("progress-bar"),
    progressContainer: document.getElementById("progress-bar")?.parentElement,
    timeRemaining: document.getElementById("time-remaining"),
    loopButton: document.getElementById("loop-single"),
    moodButtons: document.querySelectorAll("#mood-selector button"),
    volumeSlider: document.getElementById("volume-slider")
};

function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => setTimeout(resolve, 500);
        script.onerror = () => reject("YouTube API failed to load");
        document.head.appendChild(script);
    });
}

// Global for YouTube API
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        height: "390",
        width: "640",
        videoId: currentPlaylist[currentSongIndex].id,
        playerVars: { autoplay: 0, controls: 1, modestbranding: 1, showinfo: 0, rel: 0 },
        events: {
            onReady: () => {
                loadQueue(currentPlaylist);
                updateSongInfo();
                if (elements.volumeSlider && typeof player.setVolume === "function") {
                    player.setVolume(parseInt(elements.volumeSlider.value || "50", 10));
                }
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}

function loadQueue(list = playlist) {
    if (!elements.queueList) return;
    elements.queueList.innerHTML = "";
    list.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = song.title;
        li.dataset.index = index;
        li.style.cursor = "pointer";

        if (index === currentSongIndex) {
            li.classList.add("active-song");
        } else {
            li.classList.remove("active-song");
        }

        li.addEventListener("click", () => playSong(index, list));
        elements.queueList.appendChild(li);
    });
}

function playSong(index, list = playlist, skipped = 0) {
    if (!player) {
        console.warn("YouTube player not initialized yet.");
        return;
    }
    if (index >= list.length) index = 0;
    if (index < 0) index = list.length - 1;
    if (skipped >= list.length) return;

    currentPlaylist = list;
    currentSongIndex = index;
    const videoId = list[index].id;

    if (!videoId || videoId.length < 10) {
        playSong(index + 1, list, skipped + 1);
        return;
    }

    if (typeof player.loadVideoById === "function") {
        try {
            player.loadVideoById(videoId);
            setTimeout(() => {
                if (isPlaying && typeof player.playVideo === "function") {
                    player.playVideo();
                }
            }, 500);
        } catch (e) {
            console.error("Error loading video:", e);
        }
    } else {
        setTimeout(() => playSong(index, list, skipped), 500);
        return;
    }

    updateSongInfo();
    resetProgressBar();
    startVinylAnimation();
}

function updateSongInfo() {
    const song = currentPlaylist[currentSongIndex];
    if (elements.songTitle) elements.songTitle.textContent = `Now Playing: ${song.title}`;

    loadQueue(currentPlaylist);

    if (Notification.permission === "granted") {
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            try {
                new Notification("🎶 Now Playing", {
                    body: song.title,
                    icon: "logo.png" // replace with your icon URL if you want
                });
            } catch (e) {
                console.warn("Notification error:", e);
            }
        }, 300);
    }
}

function startVinylAnimation() {
    if (!elements.vinylRecord) return;
    elements.vinylRecord.classList.toggle("spinning", isPlaying);
    elements.vinylRecord.classList.toggle("pulsing", isPlaying);
}

function resetProgressBar() {
    if (!elements.progressBar) return;
    elements.progressBar.style.width = "0%";
    if (elements.timeRemaining) elements.timeRemaining.textContent = "0:00";
}

function updateTime() {
    if (!player || typeof player.getDuration !== "function" || typeof player.getCurrentTime !== "function") return;

    const duration = player.getDuration();
    const time = player.getCurrentTime();

    if (!duration || duration === 0) return;

    const remaining = duration - time;

    if (elements.progressBar) {
        const progressPercent = (time / duration) * 100;
        elements.progressBar.style.width = `${progressPercent}%`;
    }

    if (elements.timeRemaining) {
        const minutes = Math.floor(remaining / 60);
        const seconds = Math.floor(remaining % 60).toString().padStart(2, "0");
        elements.timeRemaining.textContent = `-${minutes}:${seconds}`;
    }
}

function handlePlayerStateChange(event) {
    // Player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            isPlaying = true;
            startVinylAnimation();
            if (!updateInterval) {
                updateInterval = setInterval(updateTime, 500);
            }
            break;
        case YT.PlayerState.PAUSED:
            isPlaying = false;
            startVinylAnimation();
            clearInterval(updateInterval);
            updateInterval = null;
            break;
        case YT.PlayerState.ENDED:
            if (isLooping) {
                playSong(currentSongIndex);
            } else {
                playSong(currentSongIndex + 1);
            }
            break;
        default:
            break;
    }
}

function handlePlayerError(event) {
    console.warn("Error playing video, skipping to next", event.data);
    playSong(currentSongIndex + 1);
}

function togglePlayPause() {
    if (!player) return;
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function nextSong() {
    playSong(currentSongIndex + 1);
}

function toggleLoop() {
    isLooping = !isLooping;
    elements.loopButton.classList.toggle("active-mode", isLooping);
}

function filterByMood(mood) {
    if (mood === "all") {
        currentPlaylist = [...playlist];
    } else {
        currentPlaylist = playlist.filter(song => song.moods.includes(mood));
    }
    currentSongIndex = 0;
}