// Load YouTube IFrame API
let players = [];
let videoIds = ['lofi1','lofi2','lofi3']; // list of iframe IDs
let currentVideo = 0;

function onYouTubeIframeAPIReady() {
    videoIds.forEach(id => {
        players.push(new YT.Player(id, {
            events: {
                'onStateChange': onPlayerStateChange
            }
        }));
    });
}

function onPlayerStateChange(event) {
    // If video ended, play next video
    if(event.data === YT.PlayerState.ENDED) {
        playNextVideo();
    }
}

function playNextVideo() {
    if(players[currentVideo]) players[currentVideo].pauseVideo();
    currentVideo = (currentVideo + 1) % players.length; // loop back to first
    if(players[currentVideo] && !onBreak) players[currentVideo].playVideo();
}

// Timer logic
let timer;
let totalTime = 25*60;
let remainingTime = totalTime;
let isRunning = false;
let onBreak = false;
let completedPomodoros = 0;

const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const shortBreakBtn = document.getElementById('shortBreak');
const longBreakBtn = document.getElementById('longBreak');
const chime = document.getElementById('chime');

function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60).toString().padStart(2,'0');
    const seconds = (remainingTime % 60).toString().padStart(2,'0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    if(progressBar) progressBar.style.width = ((totalTime - remainingTime) / totalTime * 100) + '%';
}

function startTimer() {
    if(!isRunning) {
        isRunning = true;
        if(players[currentVideo] && !onBreak) players[currentVideo].playVideo();
        timer = setInterval(() => {
            if(remainingTime > 0) {
                remainingTime--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                if(chime) chime.play();
                if(onBreak) {
                    alert("Break is over! Time to work.");
                    onBreak = false;
                } else {
                    completedPomodoros++;
                    alert(`Time’s up! Pomodoros completed: ${completedPomodoros}`);
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    if(players[currentVideo] && !onBreak) players[currentVideo].pauseVideo();
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    remainingTime = totalTime;
    updateDisplay();
    if(players[currentVideo]) players[currentVideo].pauseVideo();
}

function setBreak(minutes) {
    clearInterval(timer);
    isRunning = false;
    onBreak = true;
    totalTime = minutes*60;
    remainingTime = totalTime;
    updateDisplay();
    if(players[currentVideo]) players[currentVideo].pauseVideo();
    document.body.style.backgroundColor = (minutes === 5) ? '#ffe0e6' : '#ffd9b3';
}

// Button event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
shortBreakBtn.addEventListener('click', () => setBreak(5));
longBreakBtn.addEventListener('click', () => setBreak(15));

// Initialize
updateDisplay();