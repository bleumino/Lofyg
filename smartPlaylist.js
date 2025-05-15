let filteredPlaylist = [...playlist]; // Global filtered playlist
let currentSongIndex = 0;

// Attach mood button listeners AFTER the DOM is ready
function setupMoodButtons() {
    const moodButtons = document.querySelectorAll("#mood-selector button");

    moodButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons
            moodButtons.forEach(btn => btn.classList.remove("active"));

            // Add active class to clicked button
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

// YouTube API callback — called once API is ready
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
                loadQueue(playlist);  // Load full playlist initially
                updateSongInfo();
                setupMoodButtons();   // Setup mood buttons here or after DOM ready
            },
            onStateChange: handlePlayerStateChange,
            onError: handlePlayerError
        }
    });
}