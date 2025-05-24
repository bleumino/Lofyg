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

  function updateTime() {
      if (!player || typeof player.getDuration !== "function" || typeof player.getCurrentTime !== "function") return;

      const duration = player.getDuration();
      const time = player.getCurrentTime();
      if (!duration || duration === 0) return;

      const remaining = duration - time;
      if (elements.progressBar) {
          elements.progressBar.style.width = `${(time / duration) * 100}%`;
      }
      if (elements.timeRemaining) {
          elements.timeRemaining.textContent = `${Math.floor(remaining / 60)}:${String(Math.floor(remaining % 60)).padStart(2, "0")}`;
      }
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