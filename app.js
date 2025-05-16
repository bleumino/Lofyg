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
    moodButtons: document.querySelectorAll("#mood-selector button")
};

function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => setTimeout(resolve, 500);
        script.onerror = () => reject("YouTube API failed");
        document.head.appendChild(script);
    });
}

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

function loadQueue(list = playlist) {
    elements.queueList.innerHTML = "";
    list.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = song.title;
        li.dataset.index = index;
        li.style.cursor = "pointer";

        if (index === currentSongIndex) {
            li.classList.add("active-song");
        }

        li.addEventListener("click", () => playSong(index, list));
        elements.queueList.appendChild(li);
    });
}

function playSong(index, list = playlist, skipped = 0) {
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

    player.loadVideoById(videoId);
    setTimeout(() => isPlaying && player.playVideo(), 500);
    updateSongInfo();
    resetProgressBar();
    startVinylAnimation();
}

function updateSongInfo() {
    const song = currentPlaylist[currentSongIndex];
    elements.songTitle.textContent = `Now Playing: ${song.title}`;

    loadQueue(currentPlaylist); // 🔥 This refreshes the highlighted song

    if (Notification.permission === "granted") {
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            new Notification("🎶 Now Playing", {
                body: song.title,
                icon: "logo.png"
            });
        }, 300);
    }
}

function showNowPlayingNotification(title) {
    if (Notification.permission !== "granted") return;

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        new Notification("🎶 Now Playing", {
            body: title,
            icon: "logo.png"
        });
    }, 300);
}

function startVinylAnimation() {
    elements.vinylRecord.classList.toggle("spinning", isPlaying);
    elements.vinylRecord.classList.toggle("pulsing", isPlaying);
}

function resetProgressBar() {
    elements.progressBar.style.width = "0%";
}

function updateTime() {
    if (!player?.getDuration()) return;
    const duration = player.getDuration();
    const time = player.getCurrentTime();
    const remaining = duration - time;

    elements.progressBar.style.width = `${(time / duration) * 100}%`;
    elements.timeRemaining.textContent = `${Math.floor(remaining / 60)}:${String(Math.floor(remaining % 60)).padStart(2, "0")}`;
}

function startUpdatingTime() {
    clearInterval(updateInterval);
    updateInterval = setInterval(updateTime, 1000);
}

function handlePlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            isLooping ? playSong(currentSongIndex, currentPlaylist) : playSong(currentSongIndex + 1, currentPlaylist);
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
    playSong(currentSongIndex + 1, currentPlaylist);
}

elements.playButton?.addEventListener("click", () => {
    isPlaying ? player.pauseVideo() : player.playVideo();
    isPlaying = !isPlaying;
    startVinylAnimation();
});

elements.nextButton?.addEventListener("click", () => {
    playSong(currentSongIndex + 1, currentPlaylist);
});

elements.loopButton?.addEventListener("click", () => {
    isLooping = !isLooping;
    elements.loopButton.classList.toggle("active-mode", isLooping);
});

elements.moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        elements.moodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const mood = btn.dataset.mood;
        currentPlaylist = mood === "all" ? [...playlist] : playlist.filter(track => track.moods.includes(mood));

        if (currentPlaylist.length === 0) {
            alert("No tracks found for this mood.");
            return;
        }

        loadQueue(currentPlaylist);
        playSong(0, currentPlaylist);
    });
});

elements.progressContainer?.addEventListener("click", event => {
    const barWidth = elements.progressContainer.clientWidth;
    const clickX = event.offsetX;
    const seekTo = (clickX / barWidth) * player.getDuration();
    player.seekTo(seekTo, true);
    updateTime();
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        isPlaying ? player.pauseVideo() : player.playVideo();
        isPlaying = !isPlaying;
        startVinylAnimation();
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) player.playVideo();
});

document.addEventListener("click", e => {
    for (let i = 0; i < 8; i++) {
        const fleck = document.createElement('div');
        fleck.classList.add('particle');
        document.body.appendChild(fleck);
        fleck.style.left = e.clientX + 'px';
        fleck.style.top = e.clientY + 'px';
        const angle = Math.random() * 2 * Math.PI;
        const distance = 40 + Math.random() * 20;
        fleck.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        fleck.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        fleck.addEventListener('animationend', () => fleck.remove());
    }
});

loadYouTubeAPI().then(() => {
    if (typeof YT !== "undefined") onYouTubeIframeAPIReady();
});