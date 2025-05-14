// Request permission to show notifications (called after user interacts with the page)
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
}

// Show the "Now Playing" notification
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
            navigator.mediaSession.setActionHandler('playpause', () => {
                console.log("Play/Pause action triggered");
                // Add logic for play/pause here (toggle playback)
            });

            navigator.mediaSession.setActionHandler('next', () => {
                console.log("Next Song action triggered");
                // Add logic for next song here (skip to the next song in the playlist)
            });
        }

        // Close notification on click
        notification.onclick = () => {
            console.log("Notification clicked");
            notification.close(); // Optional: close the notification when clicked
        };
    }
}

// Example of how to use it
// Call this function when a song is playing or switched
function startPlayingSong(songTitle) {
    showNowPlayingNotification(songTitle);
}