// ---------- Lofi Music Playlist ----------
let playlist = [
    { id: "bQzIQa5YKvw", title: "📚 Chill Study Beats 6 • instrumental hip hop mix [2019]" },
    { id: "Fd_LPjo15j4", title: "Field Studies Vol. 1 🌳 Chillhop x Friends of Friends [lofi beats / folk / vocal]" },
    { id: "9M4jZuqdw04", title: "In the Zone 🐾 [lofi focus beats / work mix]" },
    { id: "VDtjKuS2R3E", title: "1 P.M Study Session 🎹 [calm piano]" },
    { id: "qEN5ZHDi1Kg", title: "back to school 📚 [lofi hip hop]" }
];

let player;
let currentSongIndex = Math.floor(Math.random() * playlist.length);

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
    console.log("Timer reached 0, calling timerEnded()");
    timerEnded();
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

  

  const speech = document.getElementById('loaf-speech');

function showSpeech(message, duration = 2000) {
    speech.textContent = message;
    speech.classList.add('show');
    setTimeout(() => {
        speech.classList.remove('show');
    }, duration);
}

// Example triggers:
startBtn.addEventListener('click', () => showSpeech('Focus time!'));
pauseBtn.addEventListener('click', () => showSpeech('Taking a break...'));
resetBtn.addEventListener('click', () => showSpeech('Back to zero!'));
shortBreakBtn.addEventListener('click', () => showSpeech('Short break!'));
longBreakBtn.addEventListener('click', () => showSpeech('Long break!'));
workSessionBtn.addEventListener('click', () => showSpeech('Work session!'));
add5.addEventListener('click', () => showSpeech('+5 min added!'));
add10.addEventListener('click', () => showSpeech('+10 min added!'));
add15.addEventListener('click', () => showSpeech('+15 min added!'));
add30.addEventListener('click', () => showSpeech('+30 min added!'));

// Motivational quotes

const quotes = [
    "Keep going!",
    "You’ve got this!",
    "Focus and shine!",
    "Almost there!",
    "Take a deep breath!",
    "Small steps count!",
    "Stay strong!",
    "One minute at a time!",
    "You’re doing amazing!",
    "Keep calm and code on!",
    "Stay focused, stay cool!",
    "Almost done, keep pushing!",
    "Work smart, not just hard!",
    "Breathe, focus, repeat.",
    "Good vibes only!",
    "Progress, not perfection!",
    "You can do this!",
    "Keep your head up!",
    "Believe in yourself!",
    "One task at a time!"
];

function showRandomMotivation() {
    const speech = document.getElementById('loaf-speech');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    speech.textContent = randomQuote;
    speech.classList.add('show');
    
    setTimeout(() => {
        speech.classList.remove('show');
    }, 3000); // show for 3 seconds
}

// Randomly trigger every 1–3 minutes
setInterval(() => {
    if (!isRunning) return; // optional: only motivate during work sessions
    showRandomMotivation();
}, 60000 + Math.random() * 120000); // 1–3 min in ms

const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const closeBtn = document.getElementById('close-settings');
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
const clearBg = document.getElementById('clear-bg');

settingsBtn.addEventListener('click', () => modal.classList.remove('hidden'));
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

clearBg.addEventListener('click', () => {
  localStorage.removeItem('customBg');
  document.body.style.backgroundImage = '';
});

const fontSelect = document.getElementById('fontSelect');

// Load saved font on page load
window.addEventListener('load', () => {
  const savedFont = localStorage.getItem('customFont');
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontSelect.value = savedFont;
  }
});

// Update font when user changes dropdown
fontSelect.addEventListener('change', (e) => {
  const selectedFont = e.target.value;
  document.body.style.fontFamily = selectedFont;
  localStorage.setItem('customFont', selectedFont);
});

const presetButtons = document.querySelectorAll('.preset-btn');

presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.time);
        totalTime = minutes * 60;       // update total time
        remainingTime = totalTime;      // reset remaining time
        updateDisplay();                // refresh timer display
    });
});



// Load counter from localStorage
let sessionCount = parseInt(localStorage.getItem('sessionCount')) || 0;
const sessionCounterEl = document.getElementById('session-counter');
sessionCounterEl.textContent = `🍅 Sessions Completed: ${sessionCount}`;

// Function to increment counter
function incrementSessionCounter() {
    sessionCount++;
    localStorage.setItem('sessionCount', sessionCount);
    sessionCounterEl.textContent = `🍅 Sessions Completed: ${sessionCount}`;
}

const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('quick-notes-list');
const clearNotesBtn = document.getElementById('clear-notes-btn');

// Load saved notes
let notes = JSON.parse(localStorage.getItem('quickNotes')) || [];
notes.forEach(note => displayNote(note.text, note.done));

function displayNote(text, done = false) {
    const noteEl = document.createElement('div');
    noteEl.classList.add('quick-note');
    if (done) noteEl.classList.add('done');

    const span = document.createElement('span');
    span.textContent = text;
    span.style.flex = '1';
    span.style.cursor = 'pointer';

    // Toggle done status on click
    span.addEventListener('click', () => {
        noteEl.classList.toggle('done');
        updateNotesStorage();
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('note-delete-btn');
    deleteBtn.addEventListener('click', () => {
        noteEl.remove();
        updateNotesStorage();
    });

    noteEl.appendChild(span);
    noteEl.appendChild(deleteBtn);
    notesList.appendChild(noteEl);

    updateNotesStorage();
}

// Add new note
addNoteBtn.addEventListener('click', () => {
    const note = prompt("Write a quick note about this session:");
    if (note) {
        notes.push({ text: note, done: false });
        displayNote(note);
    }
});

// Clear all notes
clearNotesBtn.addEventListener('click', () => {
    notes = [];
    localStorage.removeItem('quickNotes');
    notesList.innerHTML = '';
});

// Update localStorage
function updateNotesStorage() {
    const currentNotes = [];
    document.querySelectorAll('.quick-note').forEach(noteEl => {
        currentNotes.push({
            text: noteEl.querySelector('span').textContent,
            done: noteEl.classList.contains('done')
        });
    });
    localStorage.setItem('quickNotes', JSON.stringify(currentNotes));
}

let sessionsCompleted = 0; // increment this whenever a Pomodoro session finishes
const loafSpeech = document.getElementById('loaf-speech');
const mascotLoaf = document.getElementById('mascot-loaf');

function checkMilestone() {
    const milestones = [5, 10, 15]; // sessions where Loaf reacts
    if (milestones.includes(sessionsCompleted)) {
        // Show speech bubble
        loafSpeech.textContent = "You're on fire! 🔥";
        loafSpeech.classList.add('show');
        mascotLoaf.classList.add('jump');

        // Remove classes after animation
        setTimeout(() => {
            loafSpeech.classList.remove('show');
            mascotLoaf.classList.remove('jump');
        }, 1000);
    }
}

// Call this function whenever a session ends
function completeSession() {
    sessionsCompleted++;
    localStorage.setItem('sessionsCompleted', sessionsCompleted);
    checkMilestone();
}

// Load sessions count on page load
window.addEventListener('DOMContentLoaded', () => {
    sessionsCompleted = parseInt(localStorage.getItem('sessionsCompleted')) || 0;
});

function checkMilestone() {
    const milestones = [5, 10, 15]; // sessions where Loaf reacts
    if (milestones.includes(sessionsCompleted)) {
        // Make Loaf jump
        mascotLoaf.classList.add('jump');

        // Show speech bubble with random motivational message
        const messages = [
            "You're on fire! 🔥",
            "Keep it up! 💪",
            "Amazing progress! ✨",
            "Focus and shine! 🌟",
            "One step at a time!",
            "Keep pushing forward!",
            "You’ve got this!",
            "Stay strong!",
            "Almost there!",
            "Believe in yourself!",
            "Work smart, not just hard!",
            "Focus mode activated!",
            "Keep calm and code on!",
            "Breathe, focus, repeat.",
            "Small steps count!",
            "You’re doing amazing!",
            "Keep your head up!",
            "Stay focused, stay cool!",
            "Victory is near!",
            "Consistency is key!"
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        loafSpeech.textContent = randomMessage;
        loafSpeech.classList.add('show');

        // Remove classes after animation duration
        setTimeout(() => {
            mascotLoaf.classList.remove('jump');
            loafSpeech.classList.remove('show');
        }, 1000); // match your jump animation duration
    }
}

if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

function timerEnded() {
    completeSession(); // increments session counter & handles Loaf
    if (remainingTime <= 0) {
    clearInterval(timer);
    isRunning = false;
    timerEnded(); // triggers notification + session logic
}

    // Browser/OS notification
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Pomodoro Finished!", {
            body: "Time's up! Take a break or start again.",
            icon: "logo.png" // optional
        });
    }
}


function showLocalTimeNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        new Notification("Current Time", {
            body: `It's ${timeString}`,
            icon: "logo.png"
        });
    }
}

// Example: show time every 30 minutes
setInterval(showLocalTimeNotification, 30 * 60 * 1000);