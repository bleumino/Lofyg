// ---------- Lofi Music Playlist ----------
let playlist = [
    { id: "bQzIQa5YKvw", title: "📚 Chill Study Beats 6 • instrumental hip hop mix [2019]" },
    { id: "Fd_LPjo15j4", title: "Field Studies Vol. 1 🌳 Chillhop x Friends of Friends [lofi beats / folk / vocal]" },
    { id: "9M4jZuqdw04", title: "In the Zone 🐾 [lofi focus beats / work mix]" },
    { id: "VDtjKuS2R3E", title: "1 P.M Study Session 🎹 [calm piano]" }
];

let player;
let currentSongIndex = 0;

// ---------- Timer Variables ----------
let timer;
let totalTime = 25 * 60;
let remainingTime = totalTime;
let isRunning = false;

// DOM Elements
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const shortBreakBtn = document.getElementById('shortBreak');
const longBreakBtn = document.getElementById('longBreak');
const workSessionBtn = document.getElementById('workSession');

// ---------- YouTube API ----------
function loadYouTubeAPI() {
    const script = document.createElement('script');
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: playlist[currentSongIndex].id,
        playerVars: { autoplay: 0, controls: 0, modestbranding: 1 },
        events: { onStateChange: handleStateChange }
    });
}

function handleStateChange(event) {
    if(event.data === YT.PlayerState.ENDED){
        nextSong();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    player.loadVideoById(playlist[currentSongIndex].id);
}

// ---------- Timer Functions ----------
function updateDisplay() {
    const mins = Math.floor(remainingTime / 60).toString().padStart(2, '0');
    const secs = (remainingTime % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
    progressBar.style.width = `${((totalTime - remainingTime)/totalTime)*100}%`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        if(player) player.playVideo();
        timer = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                nextSong();
                alert("Time's up! Take a break or start again.");
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    if(player) player.pauseVideo();
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    remainingTime = totalTime;
    updateDisplay();
    if(player) player.pauseVideo();
}

function setBreak(minutes) {
    clearInterval(timer);
    isRunning = false;
    totalTime = minutes * 60;
    remainingTime = totalTime;
    updateDisplay();
    if(player) player.pauseVideo();
}

// ---------- Button Listeners ----------
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
shortBreakBtn.addEventListener('click', () => setBreak(5));
longBreakBtn.addEventListener('click', () => setBreak(15));
workSessionBtn.addEventListener('click', () => {
    totalTime = 25*60;
    remainingTime = totalTime;
    updateDisplay();
});

// ---------- Initialize ----------
updateDisplay();
loadYouTubeAPI();

document.getElementById('add5').addEventListener('click', () => {
    remainingTime += 5 * 60;
    totalTime += 5 * 60; // optional, if you want progress bar to reflect total
    updateDisplay();
});

document.getElementById('add10').addEventListener('click', () => {
    remainingTime += 10 * 60;
    totalTime += 10 * 60;
    updateDisplay();
});

document.getElementById('add15').addEventListener('click', () => {
    remainingTime += 15 * 60;
    totalTime += 15 * 60;
    updateDisplay();
});

const modeIndicator = document.getElementById('mode-indicator');
const pomodoroContainer = document.getElementById('pomodoro-container');

function setMode(mode) {
    // Remove old classes
    pomodoroContainer.classList.remove('work', 'short-break', 'long-break');

    // Add new mode class
    pomodoroContainer.classList.add(mode);

    // Update text + emoji
    if(mode === 'work') modeIndicator.textContent = '💼 Work';
    if(mode === 'short-break') modeIndicator.textContent = '☕ Short Break';
    if(mode === 'long-break') modeIndicator.textContent = '🛋️ Long Break';
}

// Update your existing break/work functions to use setMode
function setBreak(minutes) {
    clearInterval(timer);
    isRunning = false;
    totalTime = minutes * 60;
    remainingTime = totalTime;
    updateDisplay();

    if(minutes === 5) setMode('short-break');
    if(minutes === 15) setMode('long-break');
}

function setWorkSession(minutes = 25) {
    clearInterval(timer);
    isRunning = false;
    totalTime = minutes * 60;
    remainingTime = totalTime;
    updateDisplay();
    setMode('work');
}

// Add button listeners for work session and add-time buttons
document.getElementById('workSession').addEventListener('click', () => setWorkSession());
document.getElementById('add5').addEventListener('click', () => {
    remainingTime += 5 * 60;
    totalTime += 5 * 60;
    updateDisplay();
});
document.getElementById('add10').addEventListener('click', () => {
    remainingTime += 10 * 60;
    totalTime += 10 * 60;
    updateDisplay();
});
document.getElementById('add15').addEventListener('click', () => {
    remainingTime += 15 * 60;
    totalTime += 15 * 60;
    updateDisplay();
});

document.getElementById('add30').addEventListener('click', () => {
    remainingTime += 30 * 60;
    totalTime += 30 * 60;
    updateDisplay();
});
const bgUpload = document.getElementById("bg-upload");

// When user uploads
bgUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgData = e.target.result;
        document.body.style.backgroundImage = `url('${imgData}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

        // Save to localStorage
        localStorage.setItem("customBg", imgData);
    };
    reader.readAsDataURL(file);
});

// On page load, check if a background was saved
window.addEventListener("load", () => {
    const savedBg = localStorage.getItem("customBg");
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
    }
});


  /* Initially hide the page */

  // Immediately check localStorage
  const savedBg = localStorage.getItem("customBg");
  if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  }

  // Once the background is set, fade in the body
  window.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = 1;
  });