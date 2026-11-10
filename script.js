const CORRECT_PASSCODE = "1725";
let enteredPasscode = "";

// Live Date & Time formatting
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  
  const clockEl = document.getElementById('clock');
  const lockTimeEl = document.getElementById('lock-time');
  const lockDateEl = document.getElementById('lock-date');

  if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
  if (lockTimeEl) lockTimeEl.textContent = `${hours}:${minutes}`;
  if (lockDateEl) lockDateEl.textContent = dateStr;
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

function deleteNum() {
  if (enteredPasscode.length > 0) {
    enteredPasscode = enteredPasscode.slice(0, -1);
    updateDots();
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
    document.getElementById('lock-screen').classList.add('unlocked');
  } else {
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
      enteredPasscode = "";
      updateDots();
    }, 400);
  }
}

// Fixed Swipe Up & Tap Gesture
const lockScreen = document.getElementById('lock-screen');
let startY = 0;

lockScreen.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
}, { passive: true });

lockScreen.addEventListener('touchend', (e) => {
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 40) {
    showPasscode();
  }
});

lockScreen.addEventListener('click', (e) => {
  if (!e.target.classList.contains('num-btn')) {
    showPasscode();
  }
});

function showPasscode() {
  document.getElementById('passcode-container').classList.remove('hidden');
  document.getElementById('swipe-hint').style.display = 'none';
}

// App navigation
function openApp(appId) {
  const targetApp = document.getElementById(appId);
  if (targetApp) targetApp.classList.add('active');
}

function closeApp() {
  const activeApps = document.querySelectorAll('.app-window.active');
  activeApps.forEach(app => app.classList.remove('active'));
}

let isPlaying = false;
function togglePlay() {
  isPlaying = !isPlaying;
  const playBtn = document.getElementById('play-btn');
  if (playBtn) playBtn.textContent = isPlaying ? 'Pause' : 'Play';
}
