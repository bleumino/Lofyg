// ---------- Lofi Music Playlist ----------
const playlists = {
    chill: [
        { id: "bQzIQa5YKvw", title: "📚 Chill Study Beats 6 • instrumental hip hop mix [2019]" },
        { id: "Fd_LPjo15j4", title: "Field Studies Vol. 1 🌳 Chillhop x Friends of Friends [lofi beats / folk / vocal]" }
    ],
    focus: [
        { id: "9M4jZuqdw04", title: "In the Zone 🐾 [lofi focus beats / work mix]" },
        { id: "VDtjKuS2R3E", title: "1 P.M Study Session 🎹 [calm piano]" }
    ],
    happy: [
        { id: "qEN5ZHDi1Kg", title: "back to school 📚 [lofi hip hop]" }
    ]
};

// Start with a random mood (or default to chill)
let currentMood = localStorage.getItem("selectedMood") || "chill";
let playlist = playlists[currentMood];
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
            console.log('Timer tick:', remainingTime); // see it counting down
            if (remainingTime > 0) {
                remainingTime--;
                updateDisplay();
            } else {
                console.log('Timer ended!'); // confirm it's called
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

const moodButtons = document.querySelectorAll('.mood-btn');

moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        if (!playlists[mood]) return;
        
        currentMood = mood;
        playlist = playlists[mood];
        currentSongIndex = 0; // start first song of mood
        localStorage.setItem("selectedMood", mood);

        if (player) {
            player.loadVideoById(playlist[currentSongIndex].id);
            player.playVideo();
        }
    });
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

// Mascot motivational messages system
const mascotMessages = {
    loaf: [
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
    ],
    muffin: [
        "Hop to it and do your best!",
        "Every step counts, even small hops!",
        "Stay fluffy and focused!",
        "Sweet success is near!",
        "You’re rising to the challenge!",
        "Batter up! You got this!",
        "Muffin can stop you now!",
        "Sprinkle in some effort!",
        "Bake your dreams come true!",
        "You’re on a roll!",
        "Whisk away distractions!",
        "Rise and shine!",
        "Stay soft, stay strong!",
        "Hop through the hard parts!",
        "Keep mixing it up!",
        "You’re the top muffin!",
        "Keep it sweet and steady!",
        "Be the muffin you wish to see!",
        "Bake the most of today!",
        "Crumbs of progress add up!"
    ],
    mochi: [
    "Stay sly and focused!",
    "You’ve got this — clever as a fox!",
    "Focus mode: stealth activated.",
    "Slow and smart wins the race.",
    "Think sharp, act calm.",
    "Stay curious, stay creative.",
    "One quiet move at a time.",
    "Focus is your superpower.",
    "You’re clever, capable, and calm.",
    "Take a breath, then leap!",
    "Small steps today, giant leaps tomorrow.",
    "Observe first, act second.",
    "Patience is power.",
    "A clever plan beats rushing ahead.",
    "Quiet minds achieve clarity.",
    "Stay alert, stay ready.",
    "Wisdom grows in calm moments.",
    "Think like a fox, move like the wind.",
    "Your focus is your secret weapon.",
    "Soft steps, sharp mind."
]
};

function getSelectedMascot() {
    return localStorage.getItem("selectedMascot") || "loaf";
}

function showRandomMotivation() {
    const speech = document.getElementById('loaf-speech');
    const mascot = getSelectedMascot();
    const messages = mascotMessages[mascot] || mascotMessages["loaf"];
    const randomQuote = messages[Math.floor(Math.random() * messages.length)];
    speech.textContent = randomQuote;
    speech.classList.add('show');
    
    setTimeout(() => {
        speech.classList.remove('show');
    }, 3000); // show for 3 seconds
}

// Randomly trigger every 1–3 minutes
setInterval(() => {
    if (!isRunning) return; // only motivate during work sessions
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
    const milestones = [5, 10, 15]; // sessions where mascot reacts
    if (milestones.includes(sessionsCompleted)) {
        // Make Loaf jump (or mascot jump, if you add more mascots later)
        mascotLoaf.classList.add('jump');

        // Show speech bubble with random motivational message from mascotMessages
        const mascot = getSelectedMascot();
        // For milestone, pick a random message from mascot's messages, but you can also add special ones if you wish
        const messages = mascotMessages[mascot] || mascotMessages["loaf"];
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

    // Stop the timer
    clearInterval(timer);
    isRunning = false;

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

//mascot selection
const mascotImage = document.getElementById("mascot-image");
const mascotSelector = document.querySelectorAll('input[name="mascot"]');

const mascotSources = {
    loaf: "lofyg/Loaf.png",   // match the exact filename & capitalization
    muffin: "lofyg/Muffin.png", // make sure the other file matches exactly
    mochi: "lofyg/Mochi.png"
};

const mascotPersonality = {
    loaf: {
        traits: ["Calm", "Steady", "Focused"],
        color: "#4CAF50", // green for Loaf
        emoji: "🐸",
        style: "Zen and chill"
    },
    muffin: {
        traits: ["Energetic", "Cheerful", "Bouncy"],
        color: "#FFC107", // warm yellow/orange
        emoji: "🐰",
        style: "Playful and fun"
    },
    mochi: {
        traits: ["Clever", "Calm", "Feminine"],
        color: "#D88C4E", // amber/orange
        emoji: "🦊",
        style: "Thoughtful and composed"
    }
};
// (Removed duplicate/overwriting updateMascot definition)
// Event listeners
mascotSelector.forEach(radio => {
    radio.addEventListener("change", (e) => {
        updateMascot(e.target.value);
    });
});

// Load saved mascot on page load safely after DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    const savedMascot = localStorage.getItem("selectedMascot") || "loaf";
    const radioInput = document.querySelector(`input[name="mascot"][value="${savedMascot}"]`);
    if (radioInput) radioInput.checked = true;
    updateMascot(savedMascot);
});

function updateMascot(selected) {
    if (!mascotSources[selected] || !mascotImage) return;

    mascotImage.src = mascotSources[selected];

    // Update tooltip
    const mascotContainer = document.getElementById("mascot-container");
    if (mascotContainer) {
        mascotContainer.setAttribute("data-name", selected.charAt(0).toUpperCase() + selected.slice(1));
    }

    // Update quote safely
    const quote = document.getElementById("quote");
    const messages = mascotMessages[selected] || mascotMessages["loaf"];
    if (quote) quote.textContent = `"${messages[0]}"`;

    // Show/hide speech divs safely
    const loafSpeechDiv = document.getElementById("loaf-speech");
    const muffinSpeechDiv = document.getElementById("muffin-speech");
    const mochiSpeechDiv = document.getElementById("mochi-speech");

    if (loafSpeechDiv) loafSpeechDiv.classList.toggle("hidden", selected !== "loaf");
    if (muffinSpeechDiv) muffinSpeechDiv.classList.toggle("hidden", selected !== "muffin");
    if (mochiSpeechDiv) mochiSpeechDiv.classList.toggle("hidden", selected !== "mochi");

    localStorage.setItem("selectedMascot", selected);

    updateUIColors(selected);
    showMascotPersonality(selected);
}

function showMascotPersonality(selected) {
    const info = mascotPersonality[selected];
    console.log(`${info.emoji} ${selected.charAt(0).toUpperCase() + selected.slice(1)}: ${info.traits.join(', ')} — ${info.style}`);
}

function updateUIColors(selected) {
    const info = mascotPersonality[selected];
    
    // Example: change all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.backgroundColor = info.color;
        btn.style.borderColor = info.color;
        btn.style.color = "#fff"; // keep text readable
    });

    // Example: change progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.backgroundColor = info.color;
    
    // Example: change mode indicator text color
    const modeIndicator = document.getElementById('mode-indicator');
    if (modeIndicator) modeIndicator.style.color = info.color;
}

window.addEventListener('DOMContentLoaded', () => {
    const savedMood = localStorage.getItem("selectedMood") || "chill";
    if (playlists[savedMood]) {
        currentMood = savedMood;
        playlist = playlists[currentMood];
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    }
});

function updateMoodButtonColors(selectedColor) {
    const buttons = document.querySelectorAll('#mood-selector .mood-btn');
    buttons.forEach(btn => {
        btn.style.backgroundColor = selectedColor;
    });
}

// Call this whenever you update mascot colors
updateMoodButtonColors(mascotPersonality[getSelectedMascot()].color);