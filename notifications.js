// notifications.js

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
        new Notification("🎧 Now Playing", {
            body: songTitle,
            icon: "Pink Vinyl Record Icon.png" // Replace with your desired icon
        });
    }
}