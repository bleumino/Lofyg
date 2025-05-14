// Request permission to show notifications (called after user interacts with the page)
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }
}

// Array of songs (you can modify it to dynamically fetch your songs)
const songs = [
    { title: "Song 1", artist: "Artist 1" },
    { title: "Song 2", artist: "Artist 2" },
    { title: "Song 3", artist: "Artist 3" }
];

let isPlaying = false;  // Tracks the current playback state
let currentSongIndex = 0;  // Index of the currently playing song

// Function to show the "Now Playing" notification
function showNowPlayingNotification(songTitle) {
    if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("🎧 Now Playing", {
            body: songTitle,
            icon: "Pink Vinyl Record Icon.png", // Replace with your desired icon
            actions: [
                { action: "playpause", title: "Play / Pause" },
                { action: "next", title: "Next Song" }
            ]
        });

        // Set up the media session to allow controls like Play/Pause and Next Song
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songTitle,
                artist: "Lofyg",
                album: "Chill Vibes",
                artwork: [
                    { src: 'Pink Vinyl Record Icon.png', sizes: '96x96', type: 'image/png' }
                ]
            });

            // Set the action handlers for media controls
            navigator.mediaSession.setActionHandler('playpause', togglePlayPause);
            navigator.mediaSession.setActionHandler('next', skipToNextSong);
        }

        // Close notification on click
        notification.onclick = () => {
            console.log("Notification clicked");
            notification.close(); // Optional: close the notification when clicked
        };
    }
}

// Function to toggle play/pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    console.log(isPlaying ? "Playing" : "Paused");
    // Add the actual play/pause logic here, e.g., toggle an audio element
}

// Function to skip to the next song
function skipToNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;  // Loop back to the first song
    const nextSong = songs[currentSongIndex];
    console.log("Skipping to:", nextSong.title);
    // Show the next song notification
    showNowPlayingNotification(nextSong.title);
}

// Example of how to use it
// Call this function when a song is playing or switched
function startPlayingSong(songTitle) {
    showNowPlayingNotification(songTitle);
}

// Example of how to call when the user clicks the play button:
document.getElementById('play').addEventListener('click', () => {
    requestNotificationPermission();  // Request permission after user interaction
    const currentSong = songs[currentSongIndex];  // Get the current song
    showNowPlayingNotification(currentSong.title);  // Show the notification for the current song
});