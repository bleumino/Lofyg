// pomodoro.js

let timer;
let totalTime = 25 * 60; // 25 minutes
let remainingTime = totalTime;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const shortBreakBtn = document.getElementById('shortBreak');
const longBreakBtn = document.getElementById('longBreak');

// Update the timer display
function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
    const seconds = (remainingTime % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                alert('Time’s up! Take a break or start again.');
            }
        }, 1000);
    }
}

// Pause the timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

// Reset the timer to the default Pomodoro time
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    remainingTime = totalTime;
    updateDisplay();
}

// Set timer for breaks
function setBreak(minutes) {
    clearInterval(timer);
    isRunning = false;
    totalTime = minutes * 60;
    remainingTime = totalTime;
    updateDisplay();
}

// Button event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
shortBreakBtn.addEventListener('click', () => setBreak(5));
longBreakBtn.addEventListener('click', () => setBreak(15));

// Initialize display
updateDisplay();