(function() {
  // --- Playlist and Initial Variables ---
  let playlist = [
      { id: "OCFy3wWDkWM", title: "Ai Tomioka - Good bye bye（English Ver.）（Official Audio）", moods: ["chill", "relax", "calm"], language: "english"},
      { id: "t0NWBw00e1M", title: "Ai Tomioka-Good bye bye (eye to eye)", moods: ["chill", "relax"], language: "japanese"},
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
      { id: "C6CeA6vRtW4", title: "Beabadoobee - Coffee", moods: ["chill", "relax", "calm"], language: "english"},
      { id: "iEobEDPcouI", title: "Cả Một Trời Thương Nhớ - Hồ Ngọc Hà (Official Lyrics Video)", moods: ["chill", "relax", "slow-day"], language: "vietnamese"},
      { id: "F5tS5m86bOI", title: "Vũ. – Lạ LùngLẠ LÙNG (Strange) / Vũ. (Original)", moods: ["chill", "relax", "slow-day"], language: "vietnamese"},
      { id: "e89-sUH-_Is", title: "Nàng Thơ - Hoàng Dũng / OFFICIAL", moods: ["calm", "relax",], language: "vietnamese"},
      { id: "ZyowJ5GB2Dk", title: "CUCO - Amor de Siempre (Official Audio)", moods: ["calm", "relax", "slow-day"], language: "spanish"},
      { id: "kWUOPns_UJc", title: "Mi Tierra Veracruzana (En Manos de Los Macorinos) (Cover Audio)", moods: ["calm", "relax",], language: "spanish"},
      { id: "Pttkm7nCuAU", title: "BRATTY - friend (Lyric Video)", moods: ["calm", "relax", "slow-day"], language: "spanish"},
      { id: "b0BeTk25RSU", title: "202 feat. 泉まくら (New Mix)", moods: ["chill, study, relax",], language: "japanese"},
      { id: "ibGqpe2ffeg", title: "Rhythmy (Bring it! NIPPON BUDOKAN Version)", moods: ["calm", "relax"], language: "japanese"},
      { id: "nDBK2k0FwB8", title: "Blue", moods: ["calm", "relax",], language: "korean"},
      { id: "bWPxFjZ2GX0", title: "나만, 봄", moods: ["calm", "relax", "slow-day"], language: "korean"},
      { id: "c0QEK8ZH5DU", title: "You (=I)", moods: ["calm", "relax",], language: "korean"},
      { id: "amOSaNX7KJg", title: "숀 (SHAUN) - 웨이백홈 (Way Back Home) [Lyric Video]", moods: ["calm", "relax", "slow-day"], language: "korean"},
      { id: "zSFE9wzQTSA", title: "숀(SHAUN) - Way Back Home | Cover By Elina Karimova", moods: ["calm", "relax",], language: "korean"},
      { id: "tXCUpNQcpGE", title: "หัวหิน (Huahin Loop)", moods: ["calm", "relax", "slow-day"], language: "thai"},
      { id: "8DHNpcvWqhg", title: "มันเป็นใคร (Alright)", moods: ["calm", "relax", "slow-day"], language: "thai"},
      { id: "bG4PqM0Aeuo", title: "รักมือสอง", moods: ["calm", "relax",], language: "thai"},
      { id: "5viSRulpLHg", title: "Maria Froes - Vaitimbora lyrics (Acoustic cover)", moods: ["calm", "relax", "slow-day"], language: "portuguese"},
      { id: "j-T4hRJNFJI", title: "Güliz Ayla - Olmazsan Olmaz", moods: ["calm", "relax",], language: "turkish"},
      { id: "N5Qc3tH1PIM", title: "Sedef Sebüktekin - Ara (Official Video)", moods: ["calm", "relax", "slow-day"], language: "turkish"},
      { id: "d3Gp6CJ9ig0", title: "Sedef Sebüktekin - Sen İstersin (Official Video)", moods: ["calm", "relax",], language: "turkish"},
      { id: "Saxujm0_ImA", title: "Akad", moods: ["calm", "relax", "slow-day"], language: "indonesian"},
      { id: "Lr9sqNB8jEo", title: "Stephanie Poetri - I Love You 3000 (Official Audio)", moods: ["calm", "relax", "slow-day"], language: "english"},
      { id: "iQo-8wx0l0Y", title: ".Feast - Nina (Official Lyric Video)", moods: ["calm", "relax",], language: "indonesian"},
      { id: "Jj_dyacpo_o", title: "Va va vis - Florina (Lyrics)", moods: ["calm", "relax", "slow-day"], language: "french"},
      { id: "QJYn8b2hyLA", title: "Louane - Pardonne-moi (Version Acoustique) (Visualizer)", moods: ["calm", "relax", "slow-day"], language: "french"},
      { id: "bh15Hdy2W9k", title: "너의 이름은(君の名は) - 아무것도 아니야(なんでもないや) Cover by Elina Karimova", moods: ["calm", "relax", "slow-day"], language: "japanese"},
      { id: "9qlw7aSJ7B0", title: "MAMAMOO(마마무) - 별이 빛나는 밤(Starry Night) Cover By Elina Karimova", moods: ["calm", "relax",], language: "korean"},
      { id: "_g-eiuBVY2k", title: "BTS(방탄소년단) - Butter | Cover By Elina Kariomva (엘리나 커버)", moods: ["calm", "relax",], language: "english"},
      { id: "BuqTyEG1aqs", title: "아이콘(iKON) - 사랑을 했다(Love scenario) Cover By Elina Karimova", moods: ["calm", "relax",], language: "korean"},
      
      
  ];

  let currentPlaylist = [...playlist];
  window.currentPlaylist = currentPlaylist;
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
    window.playSong = playSong; // expose globally

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


//language switch
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
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Spread love everywhere you go. Let no one ever come without leaving happier. —Mother Teresa",
  "It does not matter how slowly you go, as long as you do not stop. —Confucius",
  "The only person you are destined to become is the person you decide to be. — Ralph Waldo Emerson",
  "The most difficult thing is the decision to act, the rest is merely tenacity. — Amelia Earhart",
  "I didn't fail the test. I just found 100 ways to do it wrong. — Benjamin Franklin",
  "Growth is quiet. But one day, it’ll speak for itself. -Bleumino",
  "In union there is strength. – Aesop",
  "The biggest adventure you can ever take is to live the life of your dreams.",
  "Where there is love, there is life. – Mahatma Gandhi",
  "When you do things from your soul, you feel a river moving in you, a joy. – Rumi",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. – Ralph Waldo Emerson",
  "What is meant to be will always find its way. Always.",
  "Take it slow. You’re doing better than you think.",
  "Progress isn’t loud. It’s quiet, steady, and real.",
  "You don’t have to rush to be on time for your own life.",
  "Rest is not laziness. It’s repair.",
  "It’s okay if today you only managed to breathe.",
  "You are soft, and that is your strength.",
  "One step at a time still gets you there.",
  "Create what you can’t find.",
  "Bloom quietly. Grow wildly.",
  "Nothing about you is accidental.",
  "Stay curious. Stay kind.",
  "Ctrl+Alt+Del your doubts.",
  "404: Motivation not found. Still trying anyway.",
  "You don’t have to fix everything today.",
  "You are stardust in motion. Keep dancing.",
  "A small step is still a step.",
  "Don’t quit before the miracle happens.",
  "Being creative is not about being perfect — it’s about being alive.",
  "Let the melody hold you together when everything else feels scattered.",
  "There’s no timeline for healing.",

  
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

  if (isPlaying) {
    player.pauseVideo();
    playButton.textContent = "▶️ Paused";
    playButton.classList.remove("playing");
  } else {
    player.playVideo();
    playButton.textContent = "⏸️ Playing...";
    playButton.classList.add("playing");
  }
}

playButton.addEventListener("click", togglePlayPause);

function updateLanguageIndicator(language) {
  const langText = language === "all" ? "All" : language.charAt(0).toUpperCase() + language.slice(1);
  document.getElementById("current-language").textContent = langText;
}

const languageButtons = document.querySelectorAll('.language-btn');

languageButtons.forEach(button => {
  button.addEventListener('click', () => {
    languageButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Your custom logic here, if any:
    const selectedLanguage = button.getAttribute('data-language');
    console.log("Selected language:", selectedLanguage);

    // Optional: call your language filter function
    // filterSongsByLanguage(selectedLanguage);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("shuffle-surprise")?.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
    playSong(randomIndex, currentPlaylist);

    // Optional visual feedback
    const btn = document.getElementById("shuffle-surprise");
    btn.textContent = "✨ Shuffling...";
    setTimeout(() => {
      btn.textContent = "🎲 Surprise Me";
    }, 1000);
  });
});