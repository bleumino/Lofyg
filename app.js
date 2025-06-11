(function() {
  // --- Playlist and Initial Variables ---
  let playlist = [
      { id: "xakBzg5atsM", title: "massobeats - rose water", moods: ["chill", "relax"] },
      { id: "HGMQbVfYVmI", title: "massobeats - honey jam", moods: ["study", "focus", "chill"] },
      { id: "6eWIffP2M3Y", title: "Jazz Type Beat - Bread", moods: ["study", "calm"] },
      { id: "KGQNrzqrGqw", title: "Lofi Type Beat - Onion", moods: ["chill", "relax"] },
      { id: "tEzzsT4qsbU", title: "massobeats - lucid", moods: ["calm", "focus"] },
      { id: "y7KYdqVND4o", title: "lukrembo - marshmallow", moods: ["chill"] },
      { id: "O8MYZY6sFpI", title: "animal crossing lofi", moods: ["chill", "relax"] },
      { id: "1P5BSm_oFJg", title: "Lofi Girl - Snowman", moods: ["relax", "calm"] },
      { id: "gv7hcXCnjOw", title: "Jazz Type Beat – Sunset", moods: ["chill", "study"] },
      { id: "YTUF1o9Sf3E", title: "lukrembo - affogato", moods: ["chill"] },
      { id: "EtZ2m2Zm3vY", title: "lofi type beat – biscuit", moods: ["relax", "calm"] },
      { id: "0RygB-mapsk", title: "massobeats - lotus (royalty free lofi music)", moods: ["relax", "calm", "study"] },
      { id: "yJpneVEfOvc", title: "fla.andrei - houseplants 🍃 chill lofi jazz vibes (royalty-free music)", moods: ["study", "relax"] },
      { id: "KFdmNZgCCuc", title: "straizo - laidback 😴 dreamy lofi jazz vibes (royalty-free music)", moods: ["chill", "slow-day"] },
      { id: "ej52ebiVQY0", title: "Jazzy Lofi Beat: Coastline 🌅 Royalty Free Music for Creators", moods: ["relax", "chill"] },
      { id: "nTrGU__jTLk", title: "fool parsley - something blue 🌀 royalty free lofi music (no copyright music)", moods: ["study", "calm", "relax", "slow-day"] },
      { id: "vKCDHdw7SuA", title: "simber & 7&nine - sugar & swing 🍭 chill lofi jazz vibes (no copyright music)", moods: ["chill", "relax", "slow-day"] },
      { id: "anwwKwp0W6s", title: "Heat Waves - lofi version", moods: ["study", "relax", "slow-day"] },
      { id: "QXThKEAzV64", title: "Without You - lofi version", moods: ["study", "relax", "slow-day","calm", "chill"] },
      { id: "8qgKYtRG77Q", title: "lukrembo - home (royalty free vlog music)", moods: ["study", "calm", "relax", "slow-day", "focus"] },
      { id: "AVzZq_vLD3w", title: "Lukrembo - Bean (no copyright music)", moods: ["chill", "relax"] },
      { id: "Ykt9AVKoHsQ", title: "komii - matcha cafe (no copyright music)", moods: ["relax"] },
      { id: "7AiYmoj1eL4", title: "lukrembo - spaceship (no copyright music)", moods: ["relax", "focus", "study"] },
      { id: "TNMeJbjfaB0", title: "Let Her Go [Lofi Fruits Release]", moods: ["study", "relax", "slow-day","calm", "chill"] },
      { id: "ThXrrLaYOwU", title: "I'm Yours 🍉 Lofi Hip Hop Radio", moods: ["study", "calm", "relax", "slow-day", "focus"] },
      { id: "-16M6Z8EmUg", title: "Bad Habits - lofi version", moods: ["chill", "relax",] },
      { id: "NhfswE1LGbs", title: "breakfast club 🧇 jazz lofi vibes (no copyright music / vlog music / royalty free music)", moods: ["relax", "focus", "study"] },
      { id: "tdv1M6PF5Q0", title: "coffee & cigarettes ☕️ jazz lofi vibes (no copyright music / vlog music / royalty free music)", moods: ["relax", "focus", "study", "chill", "calm", "slow-day"] },
      { id: "rdy9hGJeObk", title: "popcorn 🍿 jazz lofi vibes (no copyright music / vlog music / royalty free music)", moods: ["study", "calm", "relax", "slow-day", "focus"] },
      { id: "ueJHEht2vv8", title: "banana milk 🍌 nostalgic lofi vibes (no copyright music / vlog music / royalty free music)", moods: ["chill", "relax"] },
      { id: "mDaJZO5EcpQ", title: "oxinym & hbeat & lofi trumpet - rio left alone 🌴 royalty free lofi music (no copyright music)", moods: ["relax", "focus", "study"] },
      { id: "3gpiMt77zWM", title: "departure to the front lines ~ but it's lofi hip hop (naruto shippuden)", moods: ["relax", "focus","chill", "calm"] },
      { id: "v9jlIt7yb1Y", title: "comedy ~ but it's lofi hip hop (spy x family)", moods: ["study", "calm", "relax", "slow-day", "focus"] },
      { id: "AAo37nU_C3k", title: "sadness & sorrow but it’s lofi (Naruto)", moods: ["relax", "focus", "study"] },
      { id: "xbDVq3FA6rU", title: "Blue Bird but is it okay if it's lofi?", moods: ["relax", "focus","chill", "calm"] },
      { id: "DhJNwRacv1A", title: "Hey Onbeşli: Turkish Lofi Music to Study, Relax & Reduce Stress | Lofi Dog in Turkey", moods: ["relax","chill", "calm"] },
      { id: "GC0AhsnDMfc", title: "lukrembo - this is for you (royalty free vlog music)", moods: ["relax", "focus", "study", "chill", "calm", "slow-day"] },
      { id: "5eSSSspxGUo", title: "lukrembo - night (royalty free vlog music)", moods: ["study", "calm", "relax", "slow-day", "focus"] },
      { id: "wr4Lk0YGCvo", title: "(no copyright music) lofi type beat “tower” | royalty free vlog music | prod. by lukrembo", moods: ["chill", "relax"] },
      { id: "YmrHigi48D4", title: "komii - cappuccino (no copyright music)", moods: ["relax", "focus", "study"] },
      { id: "UqPb65MKM60?", title: "komii - journey (no copyright music)", moods: ["relax", "focus","chill", "calm"] },
      { id: "xPOy2pkImiU", title: "(no copyright music) chill type beat “branch” | free vlog music | prod. by lukrembo", moods: ["study", "calm", "relax", "slow-day", "focus"] },
      { id: "fROFG75yMRU", title: "lukrembo - boba tea (royalty free vlog music)", moods: ["relax", "focus", "study"] },
      { id: "B5YlDkIIQjE", title: "massobeats - stroll (royalty free lofi music)", moods: ["relax", "focus","chill", "calm"] },
      { id: "DSWYAclv2I8", title: "[no copyright music] 'In Dreamland ' background music", moods: ["relax","chill", "calm"] },
      { id: "BWNx0VQJjMY", title: "[no copyright music] 'Purple' lofi background music", moods: ["relax","chill", "calm"] }, 
      { id: "w4oLP7fa9Vk", title: "[no copyright music] 'Gameplay' cute background music", moods: ["relax","chill", "calm"] },
      { id: "VwiHerRkCvk", title: "no copyright music] 'On The Top' lofi background music", moods: ["relax","chill", "calm"] },
      { id: "hCtwi8XkB4o", title: "[no copyright music] 'Dreamy Mode' cute background music", moods: ["relax","chill", "calm"] },
      { id: "Abc-M-X3jmQ", title: "[no copyright music] 'Tomato farm' lofi background music", moods: ["relax","chill", "calm"] },
      { id: "i0kZXmwR6fY", title: "เพลงประกอบคลิปวีดิโอทําอาหารเมวน่ารัก🥯🥓🧀 ฟรี!! ไม่มีลิขสิทธิ์​ music cute​", moods: ["relax","chill", "calm"] }, 
      { id: "vd-RmMMl708", title: "sincerely (Violet Evergarden but is it okay if it's lofi hiphop?)", moods: ["relax","chill", "calm"] },
      { id: "XO1ZY1YX-Do", title: "gurenge (Demon Slayer but is it okay if it's lofi hiphop?)", moods: ["relax","chill", "calm"] },
      { id: "QRnO2D1jgWM", title: "unravel (Tokyo Ghoul but is it okay if it's lofi hiphop?)", moods: ["relax","chill", "calm"] },
      { id: "2P83sl-8M5A", title: "not again (Mr. Bean but is it okay if it's lofi hiphop?)", moods: ["relax","chill", "calm"] },
      { id: "8RMNWpY2tJg", title: "come along with me (Adventure Time but is it okay if it's lofi hiphop?)", moods: ["relax","chill", "calm"] },
      { id: "yROYhefx-gs", title: "crossing fields (Sword Art Online but is it okay if it's lofi hiphop?)", moods: ["relax","chill", "calm"] },
      { id: "NuT-vj7wsrc", title: "[hero too ~ but it's lofi hip hop (my hero academia)", moods: ["relax","chill", "calm"] },
      { id: "SSk_m0DELEo", title: "grandeur ~ sped up version (black clover) [anime lofi nightcore]", moods: ["relax","chill", "calm"] },
      { id: "ndfYhxXCgOc", title: "fly high (Haikyuu but is it okay if it's lofi?)", moods: ["relax","chill", "calm"] },   
      { id: "nH8Z7H1j-Yg", title: "kataware doki (Kimi No Nawa/Your Name but is it okay if it's lofi hiphop)", moods: ["relax","chill", "calm"] },
      { id: "TttnXNVMriY", title: "『Kigeki』SpyxFamily ED lofi || Gen Hoshino 'Comedy' Lofi", moods: ["relax","chill", "calm"] },
      { id: "Z1C5RnwEAeI", title: "Bleumino - Lively Cafe (non copyright lofi beats)", moods: ["relax","chill", "calm"] },
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
    const vinyl = document.querySelector('.vinyl');
    if (!vinyl) return;

    if (isPlaying) {
        vinyl.classList.add('spinning');
        vinyl.classList.add('pulsing');
    } else {
        vinyl.classList.remove('spinning');
        vinyl.classList.remove('pulsing');
    }
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

  const volumeSlider = document.getElementById("volume-slider");
const volumePercent = document.getElementById("volume-percent");

function updateVolumeDisplay() {
  const volume = parseInt(volumeSlider.value, 10);
  volumePercent.textContent = `${volume}%`;

  // If using YouTube IFrame API
  if (player && typeof player.setVolume === "function") {
    player.setVolume(volume);
  }
}

// Initialize display
updateVolumeDisplay();

// Update on input
volumeSlider.addEventListener("input", updateVolumeDisplay);
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

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        isPlaying ? player.pauseVideo() : player.playVideo();
        isPlaying = !isPlaying;
        startVinylAnimation();
    }
});
const playButton = document.getElementById("play");

function togglePlayPause() {
  const isPlaying = player.getPlayerState && player.getPlayerState() === 1;
  console.log("Play state:", isPlaying); // ✅ check if this logs correctly

  if (isPlaying) {
    player.pauseVideo();
    playButton.innerHTML = "▶️ Play"; // <-- emoji + label
    playButton.classList.remove("playing");
  } else {
    player.playVideo();
    playButton.innerHTML = "⏸️ Playing..."; // <-- emoji + label
    playButton.classList.add("playing");
  }
}
function togglePlayPause() {
  if (!player || typeof player.getPlayerState !== "function") {
    console.warn("Player not ready");
    return;
  }

  const isPlaying = player.getPlayerState() === 1;

  if (isPlaying) {
    player.pauseVideo();
    updatePlayButton(false);
  } else {
    player.playVideo();
    updatePlayButton(true);
  }
}