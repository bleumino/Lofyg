// Handle background video playback and manage tab visibility
document.addEventListener('visibilitychange', () => {
    const videoPlayer = document.getElementById('video-player');

    if (document.hidden) {
        // Pause the video when switching to another tab (optional)
        console.log("Tab hidden, pausing video");
        videoPlayer.pause();
    } else {
        // Resume video when the tab comes back into focus
        console.log("Tab focused, resuming video");
        videoPlayer.play();
    }
});

// Function to initialize video with autoplay and settings for mobile
function initializeVideoPlayer() {
    const videoPlayer = document.getElementById('video-player');

    // Ensure autoplay is enabled and muted for mobile compatibility
    videoPlayer.autoplay = true;
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.playsinline = true; // For mobile to prevent fullscreen

    // Play the video immediately (muted autoplay is allowed on mobile)
    videoPlayer.play().catch((error) => {
        console.log("Autoplay failed:", error);
        // Provide a fallback or handle error if autoplay fails
    });
}

// Initialize video player on page load
window.addEventListener('load', () => {
    initializeVideoPlayer();
});