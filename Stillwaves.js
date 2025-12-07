// --- Tate McRae Song Highlight Styles ---
const style = document.createElement('style');
style.textContent = `
.tate-song.active-song {
  background: linear-gradient(90deg, #f6e6ff 70%, #e0b3ff 100%);
  color: #a94ac7 !important;
  font-weight: bold;
  border-left: 4px solid #a94ac7;
  box-shadow: 0 2px 8px 0 rgba(169,74,199,0.08);
  transition: background 0.3s, color 0.3s;
}
`;
document.head.appendChild(style);

(function() {
  // --- Playlist and Initial Variables ---
  let playlist = [
      { id: "OCFy3wWDkWM", title: "Ai Tomioka - Good bye bye（English Ver.）（Official Audio）", moods: ["chill", "relax", "calm"], languages: ["english"]},
      { id: "t0NWBw00e1M", title: "Ai Tomioka-Good bye bye (eye to eye)", moods: ["chill", "relax"], languages: ["japanese"]},
      { id: "N85aAdWecPk", title: "冨岡 愛 - New Style (Lyric Video)", moods: ["chill", "relax"], languages: ["english"]},
      { id: "mAyyBp6gmnw", title: "愛 need your love", moods: ["calm", "relax"], languages: ["english"]},
      { id: "deE5ak0Atxw", title: "missing you", moods: ["calm", "relax"], languages: ["japanese", "english"]},
      { id: "CO7cE_SOibA", title: "グッバイバイ (Korean Ver.)", moods: ["calm", "relax"], languages: ["korean"]},
      { id: "wjj2upnfBI0", title: "Billie Eilish, Khalid - lovely", moods: ["chill", "relax", "calm", "slow-day", "study"], languages: ["english"]},
      { id: "d5gf9dXbPi0", title: "Billie Eilish - BIRDS OF A FEATHER (Official Lyric Video)", moods: ["relax", "calm", "chill"], languages: ["english"]},
      { id: "o_1aF54DO60", title: "Lana Del Rey - Young and Beautiful", moods: ["chill", "relax", "slow-day"], languages: ["english"]},
      { id: "qWUs35V3UMA", title: "B Jyun - Breeze (lyric video) [han/rom]", moods: ["chill", "relax", "slow-day", "study"], languages: ["korean"]},
      { id: "XuyUZI5gOJY", title: "BRATTY - Quédate (Audio)", moods: ["chill", "relax", "slow-day", "study"], languages: ["spanish"]},
      { id: "LRUUrEYi31E", title: "BRATTY - Honey, No Estás (Audio)", moods: ["relax", "chill", "calm", "study"], languages:["spanish"]},
      { id: "Q-NI9y1UFws", title: "BRATTY - jules (Lyric Video)", moods: ["chill", "relax", "calm"], languages: ["spanish"]},
      { id: "SuUtodOVM5M", title: "Louane - Secret (Still Image)", moods: ["chill", "relax", "slow-day"], languages: "french"},
      { id: "EbupwCn2wq0", title: "Louane - Secret (English version) (Lyrics Video)", moods: ["chill", "relax", "slow-day"], languages: ["english"]},
      { id: "p-RFpaZE5uw", title: "Louane - Les étoiles (Visualizer)", moods: ["calm", "relax", "slow-day"], languages: ["french"]},
      { id: "GK96bciRXiY", title: "Louane - On était beau (Version Acoustique)", moods: ["calm", "relax", "slow-day"], languages: ["french"]},
      { id: "X5EYfMermFo", title: "Louane - Les excuses (Lyrics Video)", moods: ["chill", "relax", "calm"], languages: "french"},
      { id: "Qzc_aX8c8g4", title: "Sasha Alex Sloan - Dancing With Your Ghost (Lyric Video)", moods: ["chill", "relax", "slow-day"], languages: ["english"]},
      { id: "SOxmA-nKfbU", title: "Lizzy McAlpine - ceilings (Official Audio)", moods: ["chill", "relax", "slow-day"], languages: ["english"]},
      { id: "Q2WcdaF8uL8", title: "Billie Eilish - Bored (Official Audio)", moods: ["calm", "relax",], languages: ["english"]},
      { id: "pbMwTqkKSps", title: "Billie Eilish - when the party's over", moods: ["calm", "relax", "slow-day"], languages: ["english"]},
      { id: "C6CeA6vRtW4", title: "Beabadoobee - Coffee", moods: ["chill", "relax", "calm"], languages: ["english"]},
      { id: "iEobEDPcouI", title: "Cả Một Trời Thương Nhớ - Hồ Ngọc Hà (Official Lyrics Video)", moods: ["chill", "relax", "slow-day"], languages: ["vietnamese"]},
      { id: "F5tS5m86bOI", title: "Vũ. – Lạ LùngLẠ LÙNG (Strange) / Vũ. (Original)", moods: ["chill", "relax", "slow-day"], language: ["vietnamese"]},
      { id: "e89-sUH-_Is", title: "Nàng Thơ - Hoàng Dũng / OFFICIAL", moods: ["calm", "relax",], languages: ["vietnamese"]},
      { id: "ZyowJ5GB2Dk", title: "CUCO - Amor de Siempre (Official Audio)", moods: ["calm", "relax", "slow-day"], languages: ["spanish"]},
      { id: "kWUOPns_UJc", title: "Mi Tierra Veracruzana (En Manos de Los Macorinos) (Cover Audio)", moods: ["calm", "relax",], languages: ["spanish"]},
      { id: "Pttkm7nCuAU", title: "BRATTY - friend (Lyric Video)", moods: ["calm", "relax", "slow-day"], languages: ["spanish"]},
      { id: "b0BeTk25RSU", title: "202 feat. 泉まくら (New Mix)", moods: ["chill, study, relax",], languages: ["japanese"]},
      { id: "ibGqpe2ffeg", title: "Rhythmy (Bring it! NIPPON BUDOKAN Version)", moods: ["calm", "relax"], languages: ["japanese"]},
      { id: "nDBK2k0FwB8", title: "Blue", moods: ["calm", "relax",], languages: ["korean"]},
      { id: "bWPxFjZ2GX0", title: "나만, 봄", moods: ["calm", "relax", "slow-day"], languages: ["korean"]},
      { id: "c0QEK8ZH5DU", title: "You (=I)", moods: ["calm", "relax",], languages: ["korean"]},
      { id: "amOSaNX7KJg", title: "숀 (SHAUN) - 웨이백홈 (Way Back Home) [Lyric Video]", moods: ["calm", "relax", "slow-day"], languages: ["korean"], backgroundType: "lyrics-video"},
      { id: "zSFE9wzQTSA", title: "숀(SHAUN) - Way Back Home | Cover By Elina Karimova", moods: ["calm", "relax",], languages: ["korean"]},
      { id: "tXCUpNQcpGE", title: "หัวหิน (Huahin Loop)", moods: ["calm", "relax", "slow-day"], languages: ["thai"]},
      { id: "8DHNpcvWqhg", title: "มันเป็นใคร (Alright)", moods: ["calm", "relax", "slow-day"], languages: ["thai"]},
      { id: "bG4PqM0Aeuo", title: "รักมือสอง", moods: ["calm", "relax",], languages: ["thai"]},
      { id: "5viSRulpLHg", title: "Maria Froes - Vaitimbora lyrics (Acoustic cover)", moods: ["calm", "relax", "slow-day"], languages: ["portuguese"]},
      { id: "j-T4hRJNFJI", title: "Güliz Ayla - Olmazsan Olmaz", moods: ["calm", "relax",], languages: ["turkish"]},
      { id: "N5Qc3tH1PIM", title: "Sedef Sebüktekin - Ara (Official Video)", moods: ["calm", "relax", "slow-day"], languages: ["turkish"]},
      { id: "d3Gp6CJ9ig0", title: "Sedef Sebüktekin - Sen İstersin (Official Video)", moods: ["calm", "relax",], languages: ["turkish"]},
      { id: "Saxujm0_ImA", title: "Akad", moods: ["calm", "relax", "slow-day"], languages: ["indonesian"]},
      { id: "Lr9sqNB8jEo", title: "Stephanie Poetri - I Love You 3000 (Official Audio)", moods: ["calm", "relax", "slow-day"], languages: ["english"]},
      { id: "iQo-8wx0l0Y", title: ".Feast - Nina (Official Lyric Video)", moods: ["calm", "relax",], languages: ["indonesian"]},
      { id: "Jj_dyacpo_o", title: "Va va vis - Florina (Lyrics)", moods: ["calm", "relax", "slow-day"], languages: ["french"]},
      { id: "QJYn8b2hyLA", title: "Louane - Pardonne-moi (Version Acoustique) (Visualizer)", moods: ["calm", "relax", "slow-day"], languages: ["french"]},
      { id: "bh15Hdy2W9k", title: "너의 이름은(君の名は) - 아무것도 아니야(なんでもないや) Cover by Elina Karimova", moods: ["calm", "relax", "slow-day"], language: ["japanese"]},
      { id: "9qlw7aSJ7B0", title: "MAMAMOO(마마무) - 별이 빛나는 밤(Starry Night) Cover By Elina Karimova", moods: ["calm", "relax",], languages: ["korean"]},
      { id: "_g-eiuBVY2k", title: "BTS(방탄소년단) - Butter | Cover By Elina Kariomva (엘리나 커버)", moods: ["calm", "relax",], languages: ["english"]},
      { id: "BuqTyEG1aqs", title: "아이콘(iKON) - 사랑을 했다(Love scenario) Cover By Elina Karimova", moods: ["calm", "relax",], languages: ["korean"]},
      { id: "98zHKN-xSHk", title: "yung kai - blue (official audio)", moods: ["calm", "relax", "slow-day"], languages: ["english"]},
      { id: "XZfyyk0_Yqs", title: "Patrick Watson - Je te laisserai des mots (Official French Lyric Video)", moods: ["calm", "relax", "slow-day"], languages: ["french"]},
      { id: "bkYVPdAhTX8", title: "Take Me In Your Arms", moods: ["calm", "relax",], languages: ["arabic"]},
      { id: "CPuXsbYCeZU", title: "Hadal Ahbek حضل احبك - Issam Alnajjar (English Version Cover)", moods: ["calm", "relax",], languages: ["english"]},
      { id: "FFwCkyHXyAQ", title: "Issam Alnajjar - Hadal Ahbek (Official Lyric Video)", moods: ["calm", "relax",], languages: ["arabic"]},
      { id: "hNqdxGsbQsA", title: "Powfu - death bed (feat. Beabadoobee)", moods: ["calm", "relax",], languages: ["english"]},
      { id: "dMSVePKXYmg", title: "Ya No Es Lo Mismo", moods: ["calm", "relax",], languages: ["spanish"]},
      { id: "B3JcHWCA-VA", title: "Oscar Anton & Clementine - nuits d'été", moods: ["calm", "relax",], languages: ["french"]},
      {id: "vldYYjCQ7jc", title: "iñigo quintero - Si No Estás (Letra Oficial)", moods:["calm"], languages: ["spanish"]},
      {id: "6ITUy1T3hd8", title: "si no estás ‐ Iñigo Quintero (cover)", moods:["calm", "relax", "slow-day"], languages: ["spanish"]},
      {id: "Q1brFg4E-3c", title: "Tate McRae - r u ok", moods:["slow-day", "sad"], languages: ["english"]},
      {id: "hsaRX6lvEAI", title: "Tate McRae - feel like shit (Lyrics)", moods:["slow-day", "sad"], languages: ["english"]},
      {id: "IGCUmv0dtNE", title: "Tate McRae - happy face (Lyrics)", moods:["slow-day", "sad"], languages: ["english"], backgroundType: "lyrics-video"},
      {id: "tIgwFHV78jg", title: "saudade, saudade", moods:["slow-day", "sad"], languages: ["portuguese"]},
      {id: "LnxVONZ55nQ", title: "Clean Bandit - Rather Be (Audio)", moods:["slow-day", "relax"], languages: ["english"]},
      {id: "92izkAK5OA0", title: "somewhere only we know (Gustixa & Rhianne)", moods:["slow-day", "relax"], languages: ["english"]},  
      {id: "YORtgGMXJhM", title: "fenekot - The Nights", moods:["slow-day", "relax"], languages: ["english"]},  
      {id: "TPpx6IWV0fk", title: "fenekot - Mistletoe", moods:["slow-day", "relax"], languages: ["english"]},
      {id: "xQfeZMS1CWM", title: "fenekot - Pretty Little Baby", moods:["slow-day", "relax"], languages: ["english"]},
      {id: "0tkgGcnRNTE", title: "나의 사춘기에게", moods:["slow-day", "relax"], language: ["korean"]},
      {id: "dYnU0DZ_iQc", title: "사랑할 수밖에", moods:["slow-day", "relax"], languages: ["korean"]},
      {id: "1SWp4sUaVBY", title: "Alex Warren - You'll Be Alright Kid (Official Lyric Video)", moods:["slow-day", "relax"], languages: ["english"]},
      {id: "l5Vtd3fTex0", title: "tan feelz - breathe | Official Music Video", moods:["slow-day", "relax"], languages: ["english"]}, 
      {id: "PvAM7wgvF5A", title: "LOUISETTE & AMAURY - Joue contre joue (Paroles)", moods:["slow-day", "relax"], languages: ["French"]}, 
      {id: "NCPCoAtCqfc", title: "Hello Vietnam - Pham Quynh Anh (Lyrics)", moods:["slow-day", "relax"], languages: ["english"]},
      {id: "8Z65MXJFPyc", title: "Tomoshi Kana(ともし・かな) - Without Crying(泣かないままで) | Emotional Japanese alt-pop with lo-fi tenderness", moods:["slow-day", "relax"], languages: ["japanese"]},
      {id: "AX0jQYaIeDc", title: "Alex Warren & ROSÉ - On My Mind (Official Music Video)", moods:["slow-day", "relax"], languages: ["english"]},
      {id: "gHPw9cLkIco", title: "恋する惑星「アナタ」 / 冨岡 愛 【中日歌詞】【歌詞付き】", moods:["slow-day", "relax"], languages: ["japanese"]},
      {id: "lPMIyFUVkzc", title: "恋する惑星「アナタ」- 冨岡 愛 Covered by 理芽 / RIM", moods:["slow-day", "relax"], languages: ["japanese"]},
      {id: "nI9PoZBu3v4", title: "HEART BEAT", moods:["slow-day", "relax"], languages: ["japanese"]},
      {id: "H7mxXm0Avts", title: "Sezen Aksu - Kaybolan Yıllar (Official Audio)", moods:["slow-day", "relax"], languages: ["turkish"]},
      {id: "qSijBXDMlK4", title: "TRINIX & Mari Froes - Vaitimbora (Lyrics)", moods:["slow-day", "relax"], languages: ["portuguese"]},
      {id: "TY7TbqU7eLo", title: "POLYCAT - มันเป็นใคร (เนื้อเพลง)", moods:["slow-day", "relax"], languages: ["thai"]},
      {id: "PuEcQHjIQos", title: "토미오카 아이(冨岡 愛) - ジェラシー(Jealousy) 【한글 번역, 가사, Korean Lyrics", moods:["slow-day", "relax"], languages: ["japanese"]},
      {id: "LksGbrIm84w", title: "冨岡 愛 - ぷれぜんと。(Lyric Video)", moods:["slow-day", "relax"], languages: ["japanese"]},
      {id: "lZRz9DVcq4s", title: "BRATTY - tuviste (lyrics video)", moods:["slow-day", "relax"], languages: ["spanish"], backgroundType: "lyrics-video"},
      {id: "Tf82c2kfPcE", title: "BRATTY - Agosto (Lyric Video)", moods:["slow-day", "relax"], languages: ["spanish"]},
      {id: "zvpo0STisUI", title: "Tate McRae - slower (Lyric Video)", moods:["slow-day", "sad"], languages: ["english"], backgroundType: "lyrics-video"},
      {id: "CjmSXgNjjwY", title: "Cat Burns - go (Higher & Faster)", moods:["slow-day", "sad"], languages: ["english"]},
      {id: "4sKNt6gbohQ", title: "sophiemarie.b - hey little girl (live) [official lyric video]", moods:["slow-day", "sad"], language: ["english"]},
      {id: "Wgspd3PrNiQ", title: "nuits d'été (acoustic)", moods:["slow-day", "sad"], languages: "french"},
      {id: "NJpwaUnClx0", title: "Oscar Anton & Clementine - reflet", moods:["slow-day", "sad"], languages: ["french", "english"], backgroundType: "lyrics-video"},
      {id: "NGAW-DGkXuM", title: "Tate McRae - run for the hills", moods:["slow-day", "sad"], languages: ["english"], backgroundType: "normal-video"},
      {id: "KrMx32Q8Q0o", title: "SEZIN - Can't Take It (Lyric Video)", moods:["slow-day", "study"], languages: ["english", "turkish"], backgroundType: "lyrics-video"},

    
      
      
  ];

  let currentPlaylist = [...playlist];
  window.currentPlaylist = currentPlaylist;

let pendingSongIndex = null; // index we just requested to play (used to guard fast skips)
let songStartTime = 0;      // timestamp when playback actually started
let skipLock = false;      // simple lock to prevent rapid double-skips

  let currentSongIndex = 0;
  let isPlaying = false;
  let isLooping = false;
  let updateInterval;
  let player;
  let notificationTimeout;

let bgYTPlayer = null; // global reference for lyrics-video iframe YT.Player
let bgYTPlayerSyncInterval = null; // interval for syncing lyrics video
let bgYTPlayerReady = false; // track bgYTPlayer readiness

// Helper to initialize lyrics-video background (as background iframe and YT.Player)
function initBackgroundLyricsVideo(videoId) {
  let bgDiv = document.getElementById("bg-video-container");
  let bgIframe;
  bgYTPlayerReady = false;
  if (!bgDiv) {
    bgDiv = document.createElement("div");
    bgDiv.id = "bg-video-container";
    Object.assign(bgDiv.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "-1",
      overflow: "hidden",
      pointerEvents: "none",
      background: "#000"
    });
    document.body.appendChild(bgDiv);
  }
  bgDiv.style.display = "block";
  // Create the background iframe
  bgIframe = document.createElement("div");
  bgIframe.id = "bg-video-iframe";
  Object.assign(bgIframe.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-1",
    pointerEvents: "none",
    opacity: "0.8",
    objectFit: "cover",
    border: "none",
    background: "#000"
  });
  // Remove any existing children in the container
  while (bgDiv.firstChild) bgDiv.removeChild(bgDiv.firstChild);
  bgDiv.appendChild(bgIframe);
  // Hide main player visually (audio only)
  const ytPlayerElem = document.getElementById("youtube-player");
  if (ytPlayerElem) ytPlayerElem.style.display = "none";
  // Destroy any previous bgYTPlayer instance
  if (bgYTPlayer && typeof bgYTPlayer.destroy === "function") {
    try { bgYTPlayer.destroy(); } catch (e) {}
    bgYTPlayer = null;
  }
  // Create new YT.Player for the background video (visual only)
  bgYTPlayer = new YT.Player(bgIframe, {
    height: "100%",
    width: "100%",
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      playlist: videoId,
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3,
      playsinline: 1
    },
    events: {
      onReady: function() {
        bgYTPlayerReady = true;
        if (typeof bgYTPlayer.setVolume === "function") bgYTPlayer.setVolume(0);
        // Autoplay handling for background video (autoplay/mute policy)
        try {
          bgYTPlayer.playVideo();
        } catch (e) {
          // If autoplay fails, try muted play
          try { bgYTPlayer.mute(); bgYTPlayer.playVideo(); } catch (e2) {}
        }
      }
    }
  });
}

// Helper to sync the background lyrics video with the main audio player
function syncLyricsVideoWithAudio(bgPlayer) {
  // Clear any previous interval
  if (bgYTPlayerSyncInterval) clearInterval(bgYTPlayerSyncInterval);
  if (!bgPlayer || !player) return;
  // Only sync if both players are ready
  function doSync() {
    if (
      typeof player.getPlayerState !== "function" ||
      typeof player.getCurrentTime !== "function" ||
      typeof bgPlayer.getPlayerState !== "function" ||
      typeof bgPlayer.getCurrentTime !== "function" ||
      typeof bgPlayer.seekTo !== "function" ||
      typeof bgPlayer.playVideo !== "function" ||
      typeof bgPlayer.pauseVideo !== "function"
    ) return;
    // Get current time and state
    let mainState = player.getPlayerState();
    let mainTime = player.getCurrentTime();
    let bgState = bgPlayer.getPlayerState();
    let bgTime = bgPlayer.getCurrentTime();
    // Sync time if difference > 0.2s
    if (Math.abs(mainTime - bgTime) > 0.25) {
      bgPlayer.seekTo(mainTime, true);
    }
    // Sync play/pause state
    if (mainState === YT.PlayerState.PLAYING && bgState !== YT.PlayerState.PLAYING) {
      try { bgPlayer.playVideo(); } catch (e) {}
    } else if ((mainState === YT.PlayerState.PAUSED || mainState === YT.PlayerState.ENDED) && bgState === YT.PlayerState.PLAYING) {
      try { bgPlayer.pauseVideo(); } catch (e) {}
    }
  }
  bgYTPlayerSyncInterval = setInterval(doSync, 250);
}

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

  /**
   * CSS style for Tate McRae songs:
   * .tate-song { background: #f6e6ff; color: #a94ac7; font-weight: bold; }
   */
  function loadQueue(list = playlist) {
      if (!elements.queueList) return;
      elements.queueList.innerHTML = "";
      list.forEach((song, index) => {
          const li = document.createElement("li");
          li.textContent = song.title;
          li.dataset.index = index;
          li.style.cursor = "pointer";
          // Highlight Tate McRae songs
          if (song.title.toLowerCase().includes("tate mcrae")) {
              li.classList.add("tate-song");
          }
          // Highlight currently playing song
          if (index === currentSongIndex) li.classList.add("active-song");
          li.addEventListener("click", () => playSong(index, list));
          elements.queueList.appendChild(li);
      });
  }

  // Flexible background support: lyrics-video, normal-video, image, default.
  function playSong(index, list = playlist, skipped = 0) {
    // Guard: ensure player API ready
    if (!player || typeof player.loadVideoById !== "function" || typeof player.playVideo !== "function") {
      console.warn("Player API not ready, retrying...");
      setTimeout(() => playSong(index, list, skipped), 500);
      return;
    }

    if (index >= list.length) index = 0;
    if (index < 0) index = list.length - 1;
    if (skipped >= list.length) return;

    // update references
    currentPlaylist = list;
    currentSongIndex = index;
    pendingSongIndex = index; // mark which index we requested

    const song = list[index];
    const videoId = song.id;
    const bgType = song.backgroundType || (song.useBackgroundVideo ? "normal-video" : "default");
    const ytPlayerElem = document.getElementById("youtube-player");
    let bgDiv = document.getElementById("bg-video-container");
    let bgIframe = document.getElementById("bg-video-iframe");
    let bgImg = document.getElementById("bg-image");

    // Remove invalid video IDs
    if (!videoId || videoId.length < 8) {
      console.warn("Invalid video id, skipping to next.", videoId);
      playSong(index + 1, list, skipped + 1);
      return;
    }

    // --- CLEANUP: Remove/hide all background elements first ---
    // Hide and clean up bgDiv, bgIframe, bgImg
    if (bgDiv) {
      bgDiv.style.display = "none";
      // Remove all children (iframe or img)
      while (bgDiv.firstChild) bgDiv.removeChild(bgDiv.firstChild);
    }
    if (bgImg) {
      bgImg.parentNode && bgImg.parentNode.removeChild(bgImg);
    }

    // Show main player by default, will hide if needed below
    if (ytPlayerElem) {
      ytPlayerElem.style.display = "";
      ytPlayerElem.style.position = "";
      ytPlayerElem.style.width = "";
      ytPlayerElem.style.height = "";
      ytPlayerElem.style.zIndex = "";
      ytPlayerElem.style.pointerEvents = "";
      ytPlayerElem.style.opacity = "";
      ytPlayerElem.style.objectFit = "";
    }

    // --- BACKGROUND MODES ---
    if (bgType === "lyrics-video") {
      // Ensure no duplicate sync intervals
      if (bgYTPlayerSyncInterval) clearInterval(bgYTPlayerSyncInterval);
      // Use the helper to create the background lyrics video (YT.Player)
      initBackgroundLyricsVideo(videoId);
      // Load audio to main hidden player
      try {
        player.loadVideoById(videoId);
        setTimeout(() => {
          player.playVideo();
          // Wait for bgYTPlayer to be fully ready before syncing
          let waitForBg = setInterval(() => {
            if (bgYTPlayer && bgYTPlayerReady && typeof bgYTPlayer.getPlayerState === "function") {
              clearInterval(waitForBg);
              // Clear any previous sync interval
              if (bgYTPlayerSyncInterval) clearInterval(bgYTPlayerSyncInterval);
              syncLyricsVideoWithAudio(bgYTPlayer);
              // Set up event listeners for play/pause/seek sync
              setupLyricsVideoPlayerSyncHandlers();
            }
          }, 100);
        }, 200);
      } catch (e) {
        console.warn("loadVideoById failed, retrying next.", e);
        setTimeout(() => playSong(index + 1, list, skipped + 1), 250);
        return;
      }
    } else if (bgType === "normal-video") {
      // Visual video as muted background (same as legacy useBackgroundVideo)
      if (!bgDiv) {
        bgDiv = document.createElement("div");
        bgDiv.id = "bg-video-container";
        Object.assign(bgDiv.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          zIndex: "-1",
          overflow: "hidden",
          pointerEvents: "none",
          background: "#000"
        });
        document.body.appendChild(bgDiv);
      }
      bgDiv.style.display = "block";
      // Create the background iframe
      bgIframe = document.createElement("iframe");
      bgIframe.id = "bg-video-iframe";
      bgIframe.dataset.vid = videoId;
      bgIframe.src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1`;
      Object.assign(bgIframe.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        zIndex: "-1",
        pointerEvents: "none",
        opacity: "0.8",
        objectFit: "cover",
        border: "none"
      });
      bgIframe.setAttribute("frameborder", "0");
      bgIframe.setAttribute("allow", "autoplay; encrypted-media");
      bgIframe.setAttribute("allowfullscreen", "1");
      while (bgDiv.firstChild) bgDiv.removeChild(bgDiv.firstChild);
      bgDiv.appendChild(bgIframe);
      if (ytPlayerElem) ytPlayerElem.style.display = "none";
      // Clear lyrics sync if switching away from lyrics-video
      if (bgYTPlayerSyncInterval) clearInterval(bgYTPlayerSyncInterval);
      try {
        player.loadVideoById(videoId);
        setTimeout(() => player.playVideo(), 200);
      } catch (e) {
        console.warn("loadVideoById failed, retrying next.", e);
        setTimeout(() => playSong(index + 1, list, skipped + 1), 250);
        return;
      }
    } else if (bgType === "image" && song.backgroundSrc) {
      // Fullscreen background image
      if (!bgDiv) {
        bgDiv = document.createElement("div");
        bgDiv.id = "bg-video-container";
        Object.assign(bgDiv.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          zIndex: "-1",
          overflow: "hidden",
          pointerEvents: "none",
          background: "#000"
        });
        document.body.appendChild(bgDiv);
      }
      bgDiv.style.display = "block";
      bgImg = document.createElement("img");
      bgImg.id = "bg-image";
      bgImg.src = song.backgroundSrc;
      Object.assign(bgImg.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        zIndex: "-1",
        pointerEvents: "none",
        objectFit: "cover",
        opacity: "0.85",
        border: "none"
      });
      while (bgDiv.firstChild) bgDiv.removeChild(bgDiv.firstChild);
      bgDiv.appendChild(bgImg);
      if (ytPlayerElem) ytPlayerElem.style.display = "none";
      // Clear lyrics sync if switching away from lyrics-video
      if (bgYTPlayerSyncInterval) clearInterval(bgYTPlayerSyncInterval);
      try {
        player.loadVideoById(videoId);
        setTimeout(() => player.playVideo(), 200);
      } catch (e) {
        console.warn("loadVideoById failed, retrying next.", e);
        setTimeout(() => playSong(index + 1, list, skipped + 1), 250);
        return;
      }
    } else {
      // --- DEFAULT MODE: no background, site default ---
      if (bgDiv) bgDiv.style.display = "none";
      if (ytPlayerElem) {
        ytPlayerElem.style.display = "";
        ytPlayerElem.style.position = "";
        ytPlayerElem.style.width = "";
        ytPlayerElem.style.height = "";
        ytPlayerElem.style.zIndex = "";
        ytPlayerElem.style.pointerEvents = "";
        ytPlayerElem.style.opacity = "";
        ytPlayerElem.style.objectFit = "";
      }
      // If we had a lyrics-video sync interval, clear it
      if (bgYTPlayerSyncInterval) clearInterval(bgYTPlayerSyncInterval);
      try {
        player.loadVideoById(videoId);
        setTimeout(() => player.playVideo(), 200);
      } catch (e) {
        console.warn("loadVideoById failed, retrying next.", e);
        setTimeout(() => playSong(index + 1, list, skipped + 1), 250);
        return;
      }
    }

    // Update UI immediately (queue highlight, title, reset progress visuals)
    updateSongInfo();
    resetProgressBar();
    startVinylAnimation();
  }

  // Keep track of event handlers for syncing bgYTPlayer with main audio player
  let lyricsSyncHandlers = {};

  function setupLyricsVideoPlayerSyncHandlers() {
    // Remove previous handlers if any
    if (lyricsSyncHandlers.remove) lyricsSyncHandlers.remove();
    if (!bgYTPlayer || !player) return;
    // --- Play/Pause sync ---
    // Listen for main player state change and propagate to bgYTPlayer
    function mainStateListener(event) {
      if (!bgYTPlayer || typeof bgYTPlayer.getPlayerState !== "function") return;
      // Only respond if lyrics-video is active
      const song = currentPlaylist[currentSongIndex];
      if (!song || (song.backgroundType !== "lyrics-video" && !song.useBackgroundLyricsVideo)) return;
      const mainState = player.getPlayerState();
      const bgState = bgYTPlayer.getPlayerState();
      if (mainState === YT.PlayerState.PLAYING && bgState !== YT.PlayerState.PLAYING) {
        try { bgYTPlayer.playVideo(); } catch (e) {}
      } else if ((mainState === YT.PlayerState.PAUSED || mainState === YT.PlayerState.ENDED) && bgState === YT.PlayerState.PLAYING) {
        try { bgYTPlayer.pauseVideo(); } catch (e) {}
      }
    }
    // --- Seek sync ---
    // Listen for seek events on main player and sync bgYTPlayer
    function mainSeekListener() {
      if (!bgYTPlayer || typeof bgYTPlayer.seekTo !== "function") return;
      // Only respond if lyrics-video is active
      const song = currentPlaylist[currentSongIndex];
      if (!song || (song.backgroundType !== "lyrics-video" && !song.useBackgroundLyricsVideo)) return;
      const mainTime = player.getCurrentTime();
      const bgTime = bgYTPlayer.getCurrentTime();
      if (Math.abs(mainTime - bgTime) > 0.2) {
        try { bgYTPlayer.seekTo(mainTime, true); } catch (e) {}
      }
    }
    // --- Attach event listeners ---
    // YouTube IFrame API does not have a native "seek" event, so we hook into progressBar and progress clicks
    // and also listen for timeupdate polling
    // Listen for state changes
    player.addEventListener && player.addEventListener("onStateChange", mainStateListener);
    // Listen for progress bar clicks (already handled in progressContainer click, so wrap it)
    const origProgressClick = elements.progressContainer?.onclick;
    function progressClickWrapper(e) {
      if (origProgressClick) origProgressClick.call(this, e);
      setTimeout(mainSeekListener, 100);
    }
    if (elements.progressContainer) {
      elements.progressContainer.addEventListener("click", mainSeekListener);
    }
    // Listen for arrow key skips or programmatic seek
    let lastSeekTime = 0;
    let seekPoller = setInterval(() => {
      if (!player || !bgYTPlayer) return;
      if (Math.abs(player.getCurrentTime() - bgYTPlayer.getCurrentTime()) > 0.3) {
        mainSeekListener();
      }
    }, 300);
    // Remove handler function
    lyricsSyncHandlers.remove = function() {
      player.removeEventListener && player.removeEventListener("onStateChange", mainStateListener);
      if (elements.progressContainer) {
        elements.progressContainer.removeEventListener("click", mainSeekListener);
      }
      clearInterval(seekPoller);
    };
  }

  // Play a song by its YouTube videoId, regardless of current filters
  function playSongById(videoId) {
    // Find the song in the full playlist
    const idx = playlist.findIndex(song => song.id === videoId);
    if (idx === -1) {
      alert("Song not found in playlist.");
      return;
    }
    // Set currentPlaylist to all songs so that index is correct
    currentPlaylist = [...playlist];
    loadQueue(currentPlaylist);
    playSong(idx, currentPlaylist);
  }
  // Expose for global usage (e.g., from console or elsewhere)
  window.playSongById = playSongById;

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



// --- Replace language button row with dropdown ---
const langContainer = document.getElementById("language-selector");
if (langContainer) {
  const dropdown = document.createElement("select");
  dropdown.id = "language-dropdown";
  dropdown.style.padding = "6px";
  dropdown.style.borderRadius = "6px";
  dropdown.style.fontSize = "14px";

  // Build dropdown options from existing buttons
  const originalButtons = langContainer.querySelectorAll("button");
  originalButtons.forEach(btn => {
    const option = document.createElement("option");
    option.value = btn.dataset.language;
    option.textContent = btn.textContent.trim();
    dropdown.appendChild(option);
  });

  // Replace old buttons with dropdown
  langContainer.innerHTML = "";
  langContainer.appendChild(dropdown);

  // Hook into your existing language filter logic
  dropdown.addEventListener("change", () => {
    const selectedLang = dropdown.value;

    currentPlaylist = selectedLang === "all"
      ? [...playlist]
      : playlist.filter(track => track.languages && track.languages.includes(selectedLang));

    if (currentPlaylist.length === 0) {
      alert("No tracks found for that language.");
      return;
    }

    loadQueue(currentPlaylist);
    playSong(0, currentPlaylist);

    updateLanguageIndicator(selectedLang);
  });
}


  elements.progressContainer?.addEventListener("click", (event) => {
      if (!player || typeof player.getDuration !== "function") return;
      const barWidth = elements.progressContainer.clientWidth;
      const clickX = event.offsetX;
      const seekTo = (clickX / barWidth) * player.getDuration();
      player.seekTo(seekTo, true);
      updateTime();
      // If lyrics-video, also seek background video
      const song = currentPlaylist[currentSongIndex];
      if (song && song.backgroundType === "lyrics-video" && bgYTPlayer && typeof bgYTPlayer.seekTo === "function") {
        setTimeout(() => {
          try { bgYTPlayer.seekTo(seekTo, true); } catch (e) {}
        }, 120);
      }
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
  "always try to look on the bright side, no matter what"

  
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
        // Lyrics-video: sync play/pause
        const song = currentPlaylist[currentSongIndex];
        if (song && song.backgroundType === "lyrics-video" && bgYTPlayer) {
          try {
            if (isPlaying && typeof bgYTPlayer.playVideo === "function") bgYTPlayer.playVideo();
            else if (!isPlaying && typeof bgYTPlayer.pauseVideo === "function") bgYTPlayer.pauseVideo();
          } catch (e) {}
        }
    }
});
const playButton = document.getElementById("play");

function togglePlayPause() {
  if (!player || typeof player.getPlayerState !== "function") return;
  const currentlyPlaying = player.getPlayerState() === 1;
  if (currentlyPlaying) {
    player.pauseVideo();
    playButton.textContent = "▶️ Paused";
    playButton.classList.remove("playing");
    // Lyrics-video: pause bgYTPlayer
    const song = currentPlaylist[currentSongIndex];
    if (song && song.backgroundType === "lyrics-video" && bgYTPlayer && typeof bgYTPlayer.pauseVideo === "function") {
      try { bgYTPlayer.pauseVideo(); } catch (e) {}
    }
  } else {
    player.playVideo();
    playButton.textContent = "⏸️ Playing...";
    playButton.classList.add("playing");
    // Lyrics-video: play bgYTPlayer
    const song = currentPlaylist[currentSongIndex];
    if (song && song.backgroundType === "lyrics-video" && bgYTPlayer && typeof bgYTPlayer.playVideo === "function") {
      try { bgYTPlayer.playVideo(); } catch (e) {}
    }
  }
}

// Remove duplicate playButton event listener (already handled above in elements.playButton?.addEventListener)
// Only add if not already attached (for compatibility)
if (playButton && !playButton.hasAttribute("data-play-handler")) {
  playButton.addEventListener("click", togglePlayPause);
  playButton.setAttribute("data-play-handler", "true");
}

function updateLanguageIndicator(language) {
  const langText = language === "all" ? "All" : language.charAt(0).toUpperCase() + language.slice(1);
  document.getElementById("current-language").textContent = langText;
}


// --- Reliable Shuffle Button Handler ---
function attachShuffleSurpriseHandler() {
  let shuffleBtn = document.getElementById("shuffle-surprise");
  if (!shuffleBtn) return false;
  if (shuffleBtn.hasAttribute("data-shuffle-handler")) return true;
  shuffleBtn.setAttribute("data-shuffle-handler", "true");
  shuffleBtn.addEventListener("click", () => {
    // Use the currentPlaylist, which is always up to date with filters
    // Defensive: filter out any undefined/null entries, just in case
    const filtered = (Array.isArray(currentPlaylist) ? currentPlaylist : []).filter(Boolean);
    if (!filtered.length) {
      shuffleBtn.textContent = "🚫 No Songs!";
      setTimeout(() => {
        shuffleBtn.textContent = "🎲 Surprise Me";
      }, 1200);
      return;
    }
    // Pick a random index different from the current song, if possible
    let randomIndex;
    if (filtered.length === 1) {
      randomIndex = 0;
    } else {
      do {
        randomIndex = Math.floor(Math.random() * filtered.length);
      } while (filtered.length > 1 && randomIndex === currentSongIndex);
    }
    // Visual feedback
    shuffleBtn.textContent = "✨ Shuffling...";
    // Play the song
    setTimeout(() => {
      playSong(randomIndex, filtered);
      shuffleBtn.textContent = "🎲 Surprise Me";
    }, 300); // Fast feedback, but allow animation
  });
  return true;
}

// Try to attach immediately, and observe DOM for late insertion
if (!attachShuffleSurpriseHandler()) {
  // If not present, use MutationObserver to wait for it
  const observer = new MutationObserver(() => {
    if (attachShuffleSurpriseHandler()) {
      observer.disconnect();
    }
  });
  observer.observe(document.body || document.documentElement, {childList: true, subtree: true});
}