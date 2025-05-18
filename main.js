let player;
let currentSongIndex = 0;

const playlist = [
  "lzF5Ho2EDc4", // Blue Ocean Skies
  "JK4Ov2PvFLg", // Blue Silence Night
];

const playPauseButton = document.getElementById("play");
const record = document.querySelector(".vinyl-record");
const songTitle = document.getElementById("song-title");
const needle = document.getElementById("needle");

// Song titles for display
const songTitles = [
  "Blue Ocean Skies",
  "Blue Silence Night"
];

// Inject YouTube API
function loadYouTubeAPI() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
}
loadYouTubeAPI();

// This gets called by the YouTube API once it's ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId: playlist[currentSongIndex],
    playerVars: {
      autoplay: 0, // Autoplay must be user-triggered for Safari
      controls: 0,
      disablekb: 1,
      loop: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1, // ✅ For iOS Safari
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    }
  });
}

// After player is ready
function onPlayerReady() {
  // Don't autoplay — Safari won't allow it unless it's triggered by click
  updateSongTitle();
}

function updateSongTitle() {
  songTitle.textContent = songTitles[currentSongIndex];
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    playNextSong();
  }
}

// Play/Pause toggle on click
playPauseButton.addEventListener("click", () => {
  const state = player.getPlayerState();

  if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
    player.pauseVideo();
    playPauseButton.textContent = "Play";
    record.classList.remove("spinning");
    needle.classList.remove("needle-down");
  } else {
    player.playVideo();
    playPauseButton.textContent = "Pause";
    record.classList.add("spinning");
    needle.classList.add("needle-down");
  }
});

// Go to next song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  player.loadVideoById(playlist[currentSongIndex]);
  updateSongTitle();
  playPauseButton.textContent = "Pause";
  record.classList.add("spinning");
  needle.classList.add("needle-down");
}