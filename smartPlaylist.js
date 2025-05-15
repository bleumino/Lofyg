// Select mood buttons
const moodButtons = document.querySelectorAll("#mood-selector button");

let filteredPlaylist = [...playlist]; // Start with full playlist

// Listen for mood button clicks
moodButtons.forEach(button => {
    button.addEventListener("click", () => {
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

// Load queue (accepts filtered playlist or defaults to full playlist)
function loadQueue(currentList) {
    const list = currentList || playlist;
    elements.queueList.innerHTML = "";
    list.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = song.title;
        listItem.dataset.index = index;
        listItem.style.cursor = "pointer";

        listItem.addEventListener("click", (event) => {
            let clickedIndex = parseInt(event.currentTarget.dataset.index, 10);
            playSong(clickedIndex, list);
        });

        elements.queueList.appendChild(listItem);
    });
}

// Play song (accepts filtered playlist or defaults)
function playSong(index, currentList = playlist, skippedCount = 0) {
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

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '390',
        width: '640',
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
                loadQueue(playlist); // Load full playlist initially
                updateSongInfo();
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}