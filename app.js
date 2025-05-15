// Your playlist with moods assigned
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

// DOM elements shortcuts
const elements = {
    queueList: document.getElementById("queue"),
    songTitle: document.getElementById("song-title"),
};

let player;
let isPlaying = false;
let currentSongIndex = 0;
let filteredPlaylist = [...playlist]; // Start with full playlist
let updateInterval;

// Load YouTube IFrame API with delay
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => setTimeout(resolve, 500);
        script.onerror = () => reject("Error loading YouTube API");
        document.head.appendChild(script);
    });
}

// Initialize YouTube Player
async function initialize() {
    try {
        await loadYouTubeAPI();
        ensureYouTubeAPIReady();
    } catch (error) {
        console.error(error);
    }
}

function ensureYouTubeAPIReady() {
    if (typeof YT !== "undefined" && YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        setTimeout(ensureYouTubeAPIReady, 500);
    }
}

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
            fs: 0,
        },
        events: {
            onReady: () => {
                loadQueue(filteredPlaylist);
                updateSongInfo();
                setupMoodButtons();
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError,
        },
    });
}

// Load songs into queue list UI
function loadQueue(list = filteredPlaylist) {
    elements.queueList.innerHTML = "";
    list.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.style.cursor = "pointer";
        listItem.addEventListener("click", () => playSong(index, list));
        elements.queueList.appendChild(listItem);
    });
}

// Play song from given playlist
function playSong(index, list = filteredPlaylist, skippedCount = 0) {
    if (index >= list.length) index = 0;
    if (index < 0) index = list.length - 1;

    if (skippedCount >= list.length) {
        console.error("No valid videos found in the playlist.");
        return;
    }

    currentSongIndex = index;
    let videoId = list[currentSongIndex].id;

    if (!videoId || videoId.length < 10) {
        console.warn(`Skipping invalid video: ${list[currentSongIndex].title}`);
        playSong(index + 1, list, skippedCount + 1);
        return;
    }

    player.loadVideoById(videoId);

    setTimeout(() => {
        if (isPlaying) player.playVideo();
    }, 500);

    elements.songTitle.textContent = `Now Playing: ${list[currentSongIndex].title}`;
    resetProgressBar();
    startVinylAnimation();
}

// Setup mood filter buttons & active state toggle
function setupMoodButtons() {
    const moodButtons = document.querySelectorAll("#mood-selector button");

    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active from all buttons
            moodButtons.forEach(btn => btn.classList.remove("active"));

            // Add active to clicked button
            button.classList.add("active");

            const selectedMood = button.dataset.mood;
            filteredPlaylist = playlist.filter(track => track.moods.includes(selectedMood));

            if (filteredPlaylist.length === 0) {
                alert("No tracks found for this mood!");
                return;
            }

            currentSongIndex = 0;
            loadQueue(filteredPlaylist);
            playSong(currentSongIndex, filteredPlaylist);
        });
    });
}

// Update displayed song title
function updateSongInfo() {
    elements.songTitle.textContent = `Now Playing: ${filteredPlaylist[currentSongIndex].title}`;
}

// Your other functions like resetProgressBar(), startVinylAnimation(), handlePlayerStateChange(), handlePlayerError() remain the same...

// Example stub for them (replace with your own implementations):
function resetProgressBar() { /* your existing code */ }
function startVinylAnimation() { /* your existing code */ }
function handlePlayerStateChange(event) { /* your existing code */ }
function handlePlayerError(event) { /* your existing code */ }

// Start the whole player init
initialize();