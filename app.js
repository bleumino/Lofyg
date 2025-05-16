let playlist = [
    { id: "xakBzg5atsM", title: "massobeats - rose water", moods: ["chill", "relax"] },
    { id: "HGMQbVfYVmI", title: "massobeats - honey jam", moods: ["study", "focus", "chill"] },
    { id: "6eWIffP2M3Y", title: "Jazz Type Beat - Bread", moods: ["study", "calm"] },
    { id: "KGQNrzqrGqw", title: "Lofi Type Beat - Onion", moods: ["chill", "relax"] },
    { id: "tEzzsT4qsbU", title: "massobeats - lucid", moods: ["calm", "focus"] },
    { id: "y7KYdqVND4o", title: "lukrembo - marshmallow", moods: ["chill"] },
    { id: "O8MYZY6sFpI", title: "animal crossing lofi", moods: ["chill", "relax"] },
    { id: "1P5BSm_oFJg", title: "Lofi Girl - Snowman", moods: ["relax", "calm"] },
    { id: "gv7hcXCnjOw", title: "Jazz Type Beat – Sunset", moods: ["chill", "study"] },
    { id: "YTUF1o9Sf3E", title: "lukrembo - affogato", moods: ["chill"] },
    { id: "EtZ2m2Zm3vY", title: "lofi type beat – biscuit", moods: ["relax", "calm"] }
];

let currentPlaylist = [...playlist];
let currentSongIndex = 0;
let isPlaying = false;
let isLooping = false;
let updateInterval;
let player;

if ("Notification" in window) {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
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
    moodButtons: document.querySelectorAll("#mood-selector button")
};

// 🔁 Load YouTube API
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => setTimeout(resolve, 500);
        script.onerror = () => reject("YouTube API failed");
        document.head.appendChild(script);
    });
}

// 🔁 When API Ready
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
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}

// 🎵 Load Songs Into Queue
function loadQueue(list = playlist) {
    elements.queueList.innerHTML = "";
    list.forEach((song, index) => {
        let li = document.createElement("li");
        li.textContent = song.title;
        li.dataset.index = index;
        li.style.cursor = "pointer";
        li.onclick = () => playSong(index, list);
        elements.queueList.appendChild(li);
    });
}

// ▶️ Play Selected Song
function playSong(index, list = playlist, skipped = 0) {
    if (index >= list.length) index = 0;
    if (index < 0) index = list.length - 1;

    if (skipped >= list.length) {
        alert("No valid tracks available.");
        return;
    }

    currentPlaylist = list;
    currentSongIndex = index;
    let videoId = list[index].id;

    if (!videoId || videoId.length < 10) {
        console.warn("Skipping invalid:", list[index].title);
        playSong(index + 1, list, skipped + 1);
        return;
    }

    player.loadVideoById(videoId);
    setTimeout(() => isPlaying && player.playVideo(), 500);
    updateSongInfo();
    resetProgressBar();
    startVinylAnimation();
}

// 🎶 Update Song Info
function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${currentPlaylist[currentSongIndex].title}`;
    showNowPlayingNotification(currentPlaylist[currentSongIndex].title);
}

function showNowPlayingNotification(title) {
    if (Notification.permission === "granted") {
        new Notification("🎶 Now Playing", {
            body: title,
            icon: "logo.png" // or any image you like!
        });
    }
}

// 💿 Vinyl + Progress
function startVinylAnimation() {
    elements.vinylRecord.classList.toggle("spinning", isPlaying);
    elements.vinylRecord.classList.toggle("pulsing", isPlaying);
}

function resetProgressBar() {
    elements.progressBar.style.width = "0%";
}

// 🕓 Update Time
function updateTime() {
    if (!player?.getDuration()) return;
    let duration = player.getDuration();
    let time = player.getCurrentTime();
    let remaining = duration - time;

    elements.progressBar.style.width = `${(time / duration) * 100}%`;
    elements.timeRemaining.textContent = `${Math.floor(remaining / 60)}:${String(Math.floor(remaining % 60)).padStart(2, "0")}`;
}

function startUpdatingTime() {
    clearInterval(updateInterval);
    updateInterval = setInterval(updateTime, 1000);
}

// 📦 Loop / Mood / Theme Toggle
elements.loopButton?.addEventListener("click", () => {
    isLooping = !isLooping;
    elements.loopButton.classList.toggle("active-mode", isLooping);
});

elements.playButton?.addEventListener("click", () => {
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
    isPlaying = !isPlaying;
    startVinylAnimation();
});

elements.nextButton?.addEventListener("click", () => {
    playSong(currentSongIndex + 1, currentPlaylist);
});

function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            if (isLooping) playSong(currentSongIndex, currentPlaylist);
            else playSong(currentSongIndex + 1, currentPlaylist);
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

function handlePlayerError() {
    console.warn("Skipping error track...");
    playSong(currentSongIndex + 1, currentPlaylist);
}

// 🎧 Mood Filter
elements.moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        elements.moodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const mood = btn.dataset.mood;
        if (mood === "all") {
            currentPlaylist = [...playlist];
        } else {
            currentPlaylist = playlist.filter(track => track.moods.includes(mood));
        }

        if (currentPlaylist.length === 0) {
            alert("No tracks found for this mood.");
            return;
        }

        loadQueue(currentPlaylist);
        playSong(0, currentPlaylist);
    });
});

// 🎬 Seek Through Song
elements.progressContainer?.addEventListener("click", event => {
    let barWidth = elements.progressContainer.clientWidth;
    let clickX = event.offsetX;
    let seekTo = (clickX / barWidth) * player.getDuration();
    player.seekTo(seekTo, true);
    updateTime();
});

// 🧠 Init
document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) player.playVideo();
});

loadYouTubeAPI().then(() => {
    if (typeof YT !== "undefined") onYouTubeIframeAPIReady();
});

let notificationTimeout;

function showNowPlayingNotification(title) {
    if (Notification.permission !== "granted") return;

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        new Notification("🎶 Now Playing", {
            body: title,
            icon: "logo.png"
        });
    }, 300); // waits 300ms before showing
}

// 🔊 Fake Audio Visualizer
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function drawVisualizerFake() {
    if (!isPlaying || !player || !player.getCurrentTime) {
        requestAnimationFrame(drawVisualizerFake);
        return;
    }

    const time = player.getCurrentTime();
    const bars = 40;
    const barWidth = canvas.width / bars;
    const heightFactor = Math.sin(time * 2) + 1; // Simulate beat

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bars; i++) {
        const height = Math.sin(i + time * 4) * 20 * heightFactor + 30;
        ctx.fillStyle = `hsl(${(i * 10 + time * 50) % 360}, 70%, 60%)`;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
    }

    requestAnimationFrame(drawVisualizerFake);
}

// Start drawing loop
drawVisualizerFake();