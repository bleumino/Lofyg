(function() {
  // --- Playlist and Initial Variables ---
  let playlist = [
      { id: "OCFy3wWDkWM", title: "Ai Tomioka - Good bye bye（English Ver.）（Official Audio）", moods: ["chill", "relax", "calm"], language: "english"},
      { id: "0NWBw00e1M", title: "Ai Tomioka-Good bye bye (eye to eye)", moods: ["chill", "relax"], language: "japanese"},
      { id: "N85aAdWecPk", title: "冨岡 愛 - New Style (Lyric Video)", moods: ["chill", "relax"], language: "english"},
      { id: "mAyyBp6gmnw", title: "愛 need your love", moods: ["calm", "relax"], language: "english"},
      { id: "deE5ak0Atxw", title: "missing you", moods: ["calm", "relax"], language: "japanese"},
      { id: "CO7cE_SOibA", title: "グッバイバイ (Korean Ver.)", moods: ["calm", "relax"], language: "korean"},
      { id: "wjj2upnfBI0", title: "Billie Eilish, Khalid - lovely", moods: ["chill", "relax", "calm", "slow-day", "study"], language: "english"},
      { id: "d5gf9dXbPi0", title: "Billie Eilish - BIRDS OF A FEATHER (Official Lyric Video)", moods: ["relax", "calm", "chill"], language: "english"},
      { id: "o_1aF54DO60", title: "Lana Del Rey - Young and Beautiful", moods: ["chill", "relax", "slow-day"], language: "english"},
      { id: "qWUs35V3UMA", title: "B Jyun - Breeze (lyric video) [han/rom]", moods: ["chill", "relax", "slow-day", "study"], language: "korean"},
      { id: "XuyUZI5gOJY", title: "BRATTY - Quédate (Audio)", moods: ["chill", "relax", "slow-day", "study"], language: "spanish"},
      { id: "LRUUrEYi31E", title: "BRATTY - Honey, No Estás (Audio)", moods: ["relax", "chill", "calm", "study"], language: "spanish"},
      { id: "Q-NI9y1UFws", title: "BRATTY - jules (Lyric Video)", moods: ["chill", "relax", "calm"], language: "spanish"},
      { id: "SuUtodOVM5M", title: "Louane - Secret (Still Image)", moods: ["chill", "relax", "slow-day"], language: "french"},
      { id: "EbupwCn2wq0", title: "Louane - Secret (English version) (Lyrics Video)", moods: ["chill", "relax", "slow-day"], language: "english"},
      { id: "p-RFpaZE5uw", title: "Louane - Les étoiles (Visualizer)", moods: ["calm", "relax", "slow-day"], language: "french"},
      { id: "GK96bciRXiY", title: "Louane - On était beau (Version Acoustique)", moods: ["calm", "relax", "slow-day"], language: "french"},
      { id: "X5EYfMermFo", title: "Louane - Les excuses (Lyrics Video)", moods: ["chill", "relax", "calm"], language: "french"},
      { id: "Qzc_aX8c8g4", title: "Sasha Alex Sloan - Dancing With Your Ghost (Lyric Video)", moods: ["chill", "relax", "slow-day"], language: "english"},
      { id: "SOxmA-nKfbU", title: "Lizzy McAlpine - ceilings (Official Audio)", moods: ["chill", "relax", "slow-day"], language: "english"},
      { id: "Q2WcdaF8uL8", title: "Billie Eilish - Bored (Official Audio)", moods: ["calm", "relax",], language: "english"},
      { id: "pbMwTqkKSps", title: "Billie Eilish - when the party's over", moods: ["calm", "relax", "slow-day"], language: "english"},
      
  ];

  let currentPlaylist = [...playlist];
  let currentSongIndex = 0;
  let isPlaying = false;
  let isLooping = false;
  let updateInterval;
  let player;
  let notificationTimeout;

  if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
  }

  const elements = {
      queueList: document.getElementById("queue"),
      playButton: document.getElementById("play"),
      nextButton: document.getElementById("next"),
      vinylRecord: document.getElementById("vinyl"),
      songTitle: document.getElementById("song-title"),
      progressBar: document.getElementById("progress-bar"),
      progressContainer: document.getElementById("progress-bar")?.parentElement,
      timeRemaining: document.getElementById("time-remaining"),
      loopButton: document.getElementById("loop-single"),
      moodButtons: document.querySelectorAll("#mood-selector button"),
      volumeSlider: document.getElementById("volume-slider")
  };

  function loadYouTubeAPI() {
      return new Promise((resolve, reject) => {
          if (window.YT && window.YT.Player) {
              // API already loaded
              resolve();
              return;
          }
          const script = document.createElement("script");
          // Cache-busting query to avoid browser caching
          script.src = "https://www.youtube.com/iframe_api?v=" + Date.now();
          script.onload = () => setTimeout(resolve, 500);
          script.onerror = () => reject("YouTube API failed");
          document.head.appendChild(script);
      });
  }

  window.onYouTubeIframeAPIReady = function() {
      player = new YT.Player("youtube-player", {
          height: "390",
          width: "640",
          videoId: currentPlaylist[currentSongIndex].id,
          playerVars: { autoplay: 0, controls: 1, modestbranding: 1, showinfo: 0, rel: 0 },
          events: {
              onReady: () => {
                  loadQueue(currentPlaylist);
                  updateSongInfo();
                  if (elements.volumeSlider && typeof player.setVolume === "function") {
                      player.setVolume(parseInt(elements.volumeSlider.value || "50", 10));
                  }
              },
              onStateChange: handlePlayerStateChange,
              onError: handlePlayerError
          }
      });
  };

  function loadQueue(list = playlist) {
      if (!elements.queueList) return;
      elements.queueList.innerHTML = "";
      list.forEach((song, index) => {
          const li = document.createElement("li");
          li.textContent = song.title;
          li.dataset.index = index;
          li.style.cursor = "pointer";
          if (index === currentSongIndex) li.classList.add("active-song");
          li.addEventListener("click", () => playSong(index, list));
          elements.queueList.appendChild(li);
      });
  }

  function playSong(index, list = playlist, skipped = 0) {
      if (!player || typeof player.loadVideoById !== "function" || typeof player.playVideo !== "function") {
          console.warn("Player API not ready, retrying...");
          setTimeout(() => playSong(index, list, skipped), 500);
          return;
      }
      if (index >= list.length) index = 0;
      if (index < 0) index = list.length - 1;
      if (skipped >= list.length) return;

      currentPlaylist = list;
      currentSongIndex = index;
      const videoId = list[index].id;

      if (!videoId || videoId.length < 10) {
          playSong(index + 1, list, skipped + 1);
          return;
      }

      player.loadVideoById(videoId);
      setTimeout(() => {
          if (isPlaying) player.playVideo();
      }, 600);

      updateSongInfo();
      resetProgressBar();
      startVinylAnimation();
  }

  function updateSongInfo() {
      const song = currentPlaylist[currentSongIndex];
      if (elements.songTitle) elements.songTitle.textContent = `Now Playing: ${song.title}`;
      loadQueue(currentPlaylist);

      if (Notification.permission === "granted") {
          clearTimeout(notificationTimeout);
          notificationTimeout = setTimeout(() => {
              try {
                  new Notification("🎶 Now Playing", {
                      body: song.title,
                      icon: "logo.png"
                  });
              } catch (e) {
                  console.warn("Notification error:", e);
              }
          }, 300);
      }
  }

  function startVinylAnimation() {
      if (!elements.vinylRecord) return;
      elements.vinylRecord.classList.toggle("spinning", isPlaying);
      elements.vinylRecord.classList.toggle("pulsing", isPlaying);
  }

  function resetProgressBar() {
      if (!elements.progressBar) return;
      elements.progressBar.style.width = "0%";
  }

 function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [
        hrs > 0 ? String(hrs).padStart(2, "0") : null,
        String(mins).padStart(2, "0"),
        String(secs).padStart(2, "0")
    ].filter(Boolean).join(":");
}

function updateTime() {
    if (!player?.getDuration()) return;
    const duration = player.getDuration();
    const currentTime = player.getCurrentTime();

    elements.progressBar.style.width = `${(currentTime / duration) * 100}%`;
    elements.timeRemaining.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}


  function startUpdatingTime() {
      clearInterval(updateInterval);
      updateInterval = setInterval(updateTime, 1000);
  }

  function handlePlayerStateChange(event) {
      switch (event.data) {
          case YT.PlayerState.ENDED:
              if (isLooping) {
                  playSong(currentSongIndex, currentPlaylist);
              } else {
                  playSong(currentSongIndex + 1, currentPlaylist);
              }
              break;
          case YT.PlayerState.PLAYING:
              isPlaying = true;
              startUpdatingTime();
              break;
          case YT.PlayerState.PAUSED:
              isPlaying = false;
              clearInterval(updateInterval);
              break;
      }
      startVinylAnimation();
  }

  function handlePlayerError() {
      playSong(currentSongIndex + 1, currentPlaylist);
  }

  elements.playButton?.addEventListener("click", () => {
      if (!player) return;
      if (isPlaying && typeof player.pauseVideo === "function") {
          player.pauseVideo();
      } else if (typeof player.playVideo === "function") {
          player.playVideo();
      }
      isPlaying = !isPlaying;
      startVinylAnimation();
  });

  elements.nextButton?.addEventListener("click", () => {
      playSong(currentSongIndex + 1, currentPlaylist);
  });

  elements.loopButton?.addEventListener("click", () => {
      isLooping = !isLooping;
      elements.loopButton.classList.toggle("active-mode", isLooping);
  });

  elements.moodButtons.forEach(btn => {
      btn.addEventListener("click", () => {
          elements.moodButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          const mood = btn.dataset.mood;
          currentPlaylist = mood === "all" ? [...playlist] : playlist.filter(track => track.moods.includes(mood));

          if (currentPlaylist.length === 0) {
              alert("No tracks found for this mood.");
              return;
          }

          loadQueue(currentPlaylist);
          playSong(0, currentPlaylist);
      });
  });

 const languageButtons = document.querySelectorAll("#language-selector button");

languageButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Mark active button
    languageButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const selectedLang = btn.dataset.language; // ← Make sure you're using data-language in your HTML

    currentPlaylist = selectedLang === "all"
      ? [...playlist]
      : playlist.filter(track => track.language === selectedLang);

    if (currentPlaylist.length === 0) {
      alert("No tracks found for that language.");
      return;
    }

    loadQueue(currentPlaylist);
    playSong(0, currentPlaylist);
  });
});


  elements.progressContainer?.addEventListener("click", (event) => {
      if (!player || typeof player.getDuration !== "function") return;
      const barWidth = elements.progressContainer.clientWidth;
      const clickX = event.offsetX;
      const seekTo = (clickX / barWidth) * player.getDuration();
      player.seekTo(seekTo, true);
      updateTime();
  });

  // Load YouTube API and initialize player
  loadYouTubeAPI().then(() => {
      if (typeof YT !== "undefined" && YT.Player) {
          window.onYouTubeIframeAPIReady();
      }
  });

  // Volume slider event
  if (elements.volumeSlider) {
      elements.volumeSlider.addEventListener("input", () => {
          const volume = parseInt(elements.volumeSlider.value, 10);
          if (player && typeof player.setVolume === "function") {
              player.setVolume(volume);
          }
      });
  }

  // Fun particle effect on clicks
  document.addEventListener("click", e => {
      for (let i = 0; i < 8; i++) {
          const fleck = document.createElement('div');
          fleck.classList.add('particle');
          document.body.appendChild(fleck);
          fleck.style.left = e.clientX + 'px';
          fleck.style.top = e.clientY + 'px';
          const angle = Math.random() * 2 * Math.PI;
          const distance = 40 + Math.random() * 20;
          fleck.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
          fleck.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
          setTimeout(() => fleck.remove(), 1000);
      }
  });
})();

const quotes = [
  "It needs to be said and heard: it's OK to be who you are. – Hailee Steinfeld",
  "One step at a time is all it takes.",
  "Take a moment to breathe and relax.",
  "Progress, not perfection.",
  "Let the rhythm calm your mind.",
  "Your energy is enough.",
  "Keep growing at your pace.",
  "You’re doing better than you think.",
  "Be gentle with yourself today.",
  "You are enough, just as you are.",
  "Rest is productive too.",
  "The time is always right to do what is right. – Martin Luther King Jr.",
  "Don't let anyone ever make you feel like you don't deserve what you want. – Heath Ledger",
  "Imperfection is beauty, madness is genius and it's better to be absolutely ridiculous than absolutely boring. – Marilyn Monroe",
  "You’re only human. You live once and life is wonderful, so eat the damn red velvet cupcake. – Emma Stone",
  "The best thing to hold onto in life is each other. – Audrey Hepburn",
  "No matter what happens in life, be good to people. Being good to people is a wonderful legacy to leave behind. – Taylor Swift",
  "Success is most often achieved by those who don’t know that failure is inevitable. – Coco Chanel",
  "Just because you're not where you want to be yet doesn't mean you're not making progress. – Zendaya",
  "Be humble, hungry, and always be the hardest worker in the room. – Dwayne “The Rock” Johnson",
  "Try and fail, but never fail to try. – Jared Leto",
  "To thine own self be true. – Dolly Parton",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "You miss 100% of the shots you don’t take. – Wayne Gretzky",
  "The best revenge is massive success. – Frank Sinatra",
  "The only way to do great work is to love what you do. – Steve Jobs"
  
];

function showQuotePopup() {
  const popup = document.getElementById('quote-popup');
  const quoteText = document.getElementById('quote-text');

  if (!popup || !quoteText) return;

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.textContent = randomQuote;

  popup.classList.remove('hidden');

  // Hide the popup after 20 seconds
  setTimeout(() => {
    popup.classList.add('hidden');
  }, 20000); // 20 seconds
}

// First popup after 8 seconds
setTimeout(showQuotePopup, 8000);

// Repeat every 1 minute (60,000 ms)
setInterval(showQuotePopup, 60000);

function updateLocalTime() {
  const timeElement = document.getElementById('local-time');
  const iconElement = document.getElementById('time-icon');
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;

  // Set time-based icon
  let icon = '⏳';
  if (hours >= 5 && hours < 11) icon = '🌅';        // Morning
  else if (hours >= 11 && hours < 17) icon = '🌞';   // Afternoon
  else if (hours >= 17 && hours < 21) icon = '🌇';   // Evening
  else icon = '🌙';                                  // Night

  iconElement.textContent = icon;
}

// Start the clock
updateLocalTime();
setInterval(updateLocalTime, 1000); // Update every second


document.getElementById("vibeButton").addEventListener("click", () => {
  document.getElementById("vibePopup").classList.remove("hidden");
});

document.getElementById("closeVibe").addEventListener("click", () => {
  document.getElementById("vibePopup").classList.add("hidden");
});

document.getElementById("submitVibe").addEventListener("click", () => {
  const vibeText = document.getElementById("vibeInput").value.trim();
  const vibeName = document.getElementById("vibeName").value.trim();

  if (vibeText.length === 0) {
    alert("Please write a vibe first!");
    return;
  }

  alert(`Thanks for your vibe${vibeName ? ', ' + vibeName : ''}!\n\n"${vibeText}"`);

  document.getElementById("vibeInput").value = "";
  document.getElementById("vibeName").value = "";
  document.getElementById("vibePopup").classList.add("hidden");

  // Future: You can store it to Firebase or localStorage here.
});

ocument.getElementById("submitVibe").addEventListener("click", async () => {
  const vibe = document.getElementById("vibeInput").value.trim();
  const name = document.getElementById("vibeName").value.trim() || "Anonymous";

  if (!vibe) {
    alert("Please write your vibe before submitting!");
    return;
  }

  await fetch("https://script.google.com/macros/s/AKfycbwVrmlYmI3MUGa7Ip6LzVyrKIw041sZa37F0vQJ4ec-Lw0d0bQiaSKfEdH2PdKoFyGl7w/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vibe, name })
  });

  document.getElementById("vibeInput").value = "";
  document.getElementById("vibeName").value = "";
  alert("Vibe sent! ✨");
});

async function loadVibes() {
  const response = await fetch("YOUR_WEB_APP_URL");
  const vibes = await response.json();

  const vibeDisplay = document.getElementById("vibeDisplay");
  vibeDisplay.innerHTML = "";

  vibes.reverse().forEach(v => {
    const vibeEl = document.createElement("div");
    vibeEl.className = "vibe-card";
    vibeEl.innerHTML = `
      <p><strong>${v.name}</strong> says:</p>
      <p>“${v.vibe}”</p>
      <small>${new Date(v.timestamp).toLocaleString()}</small>
      <hr>
    `;
    vibeDisplay.appendChild(vibeEl);
  });
}

window.addEventListener("load", loadVibes);