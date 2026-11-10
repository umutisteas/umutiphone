const CORRECT_PASSCODE = "1725";
let enteredPasscode = "";

// Live Clock with Date Formatting
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  
  const lockTimeEl = document.getElementById('lock-time');
  const lockDateEl = document.getElementById('lock-date');
  const appClockEl = document.getElementById('app-clock-display');

  if (lockTimeEl) lockTimeEl.textContent = `${hours}:${minutes}`;
  if (lockDateEl) lockDateEl.textContent = dateStr;
  if (appClockEl) appClockEl.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Passcode Logic
function pressNum(digit) {
  if (enteredPasscode.length < 4) {
    enteredPasscode += digit;
    updateDots();
    
    if (enteredPasscode.length === 4) {
      setTimeout(verifyPasscode, 150);
    }
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index < enteredPasscode.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

function verifyPasscode() {
  const container = document.getElementById('passcode-container');
  if (enteredPasscode === CORRECT_PASSCODE) {
    const lockEl = document.getElementById('lock-screen');
    lockEl.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease';
    lockEl.classList.add('unlocked');
  } else {
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
      enteredPasscode = "";
      updateDots();
    }, 400);
  }
}

function cancelPasscode() {
  document.getElementById('passcode-container').classList.add('hidden');
  enteredPasscode = "";
  updateDots();
}

// Silky-Smooth iOS Swipe Engine
const lockScreen = document.getElementById('lock-screen');
let startY = 0;
let currentY = 0;
let isDragging = false;
let ticking = false;

function applyTransform() {
  const deltaY = currentY - startY;
  
  if (deltaY < 0) {
    const progress = Math.min(Math.abs(deltaY) / 300, 1);
    const scale = 1 - (progress * 0.08);
    lockScreen.style.transform = `translateY(${deltaY}px) scale(${scale})`;
  } else {
    const resistance = deltaY * 0.15;
    lockScreen.style.transform = `translateY(${resistance}px) scale(1)`;
  }
  ticking = false;
}

lockScreen.addEventListener('touchstart', (e) => {
  if (e.target.closest('.shortcut-btn') || e.target.closest('.passcode-container')) return;
  
  startY = e.touches[0].clientY;
  currentY = startY;
  isDragging = true;
  lockScreen.style.transition = 'none';
}, { passive: true });

lockScreen.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  currentY = e.touches[0].clientY;
  
  if (!ticking) {
    requestAnimationFrame(applyTransform);
    ticking = true;
  }
}, { passive: true });

lockScreen.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  isDragging = false;
  
  const deltaY = currentY - startY;
  
  lockScreen.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease';
  
  if (deltaY < -70) {
    showPasscode();
    lockScreen.style.transform = 'translateY(0px) scale(1)';
  } else {
    lockScreen.style.transform = 'translateY(0px) scale(1)';
  }
});

lockScreen.addEventListener('click', (e) => {
  if (!e.target.closest('.shortcut-btn') && !e.target.classList.contains('num-btn') && !e.target.closest('.text-action-btn')) {
    showPasscode();
  }
});

function showPasscode() {
  document.getElementById('passcode-container').classList.remove('hidden');
}

let flashlightOn = false;
function toggleFlashlight(e) {
  flashlightOn = !flashlightOn;
  const btn = e.currentTarget;
  btn.classList.toggle('active', flashlightOn);
}

function openCamera() {
  alert("Camera shortcut pressed!");
}

// App Navigation
function openApp(appId) {
  const targetApp = document.getElementById(appId);
  if (targetApp) targetApp.classList.add('active');
}

function closeApp() {
  const activeApps = document.querySelectorAll('.app-window.active');
  activeApps.forEach(app => app.classList.remove('active'));
}

// Spotify Playlist & Player Logic
const playlist = [
  { title: "Alas Dose", artist: "Cup of Joe" },
  { title: "Purple", artist: "Olivia Rodrigo" },
  { title: "Estranghero", artist: "Cup of Joe" },
  { title: "Always", artist: "Daniel Caesar" },
  { title: "Superpowers", artist: "Daniel Caesar" },
  { title: "Walang Hangganan", artist: "IV OF SPADES" },
  { title: "Tahanan", artist: "Adie" },
  { title: "seasons", artist: "wave to earth" },
  { title: "I Like Me Better", artist: "Lauv" },
  { title: "Passenger Seat", artist: "Stephen Speaks" },
  { title: "Ride Home", artist: "Ben & Ben" },
  { title: "On the Wings of Love", artist: "Kyla" },
  { title: "Patutunguhan", artist: "Cup of Joe" },
  { title: "Tingin", artist: "Cup of Joe" }
];
let currentTrackIndex = 0;
let isPlaying = true;

// Play song in-place without triggering full screen popup
function playSong(index) {
  currentTrackIndex = index;
  isPlaying = true;
  updateSongDisplay();
}

function togglePlay() {
  isPlaying = !isPlaying;
  const miniBtn = document.getElementById('mini-play-btn');
  const playSvg = document.getElementById('main-play-svg');
  
  if (miniBtn) miniBtn.textContent = isPlaying ? '⏸' : '▶';
  if (playSvg) {
    if (isPlaying) {
      playSvg.innerHTML = `<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>`;
    } else {
      playSvg.innerHTML = `<polygon points="7,4 19,12 7,20"/>`;
    }
  }
}

function toggleShuffle(btn) {
  btn.classList.toggle('active');
}

function updateSongDisplay() {
  const track = playlist[currentTrackIndex];
  const miniTitle = document.getElementById('mini-title');
  const miniArtist = document.getElementById('mini-artist');

  if (miniTitle) miniTitle.textContent = track.title;
  if (miniArtist) miniArtist.textContent = track.artist;
  
  isPlaying = true;
  const miniBtn = document.getElementById('mini-play-btn');
  const playSvg = document.getElementById('main-play-svg');
  if (miniBtn) miniBtn.textContent = '⏸';
  if (playSvg) playSvg.innerHTML = `<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>`;
}

// Bounded Collapsible Fade & Scaling Header Effect
function handleSpotifyScroll() {
  const scrollContainer = document.getElementById('spotify-body');
  const coverCard = document.getElementById('playlist-cover-card');
  const header = document.querySelector('.spotify-header');
  const headerTitle = document.getElementById('spotify-header-title');
  
  const scrollTop = scrollContainer.scrollTop;
  const maxScroll = 130;
  
  const progress = Math.min(scrollTop / maxScroll, 1);
  const opacity = 1 - progress;
  const scale = 1 - (progress * 0.15);

  coverCard.style.opacity = opacity;
  coverCard.style.transform = `scale(${scale})`;

  if (scrollTop > 60) {
    header.classList.add('scrolled');
    headerTitle.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    headerTitle.classList.remove('visible');
  }
}
