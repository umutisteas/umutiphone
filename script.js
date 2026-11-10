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
    lockEl.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
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

// True-to-Life iOS Gesture Engine
const lockScreen = document.getElementById('lock-screen');
let startY = 0;
let currentY = 0;
let startTime = 0;
let isDragging = false;
let ticking = false;

function applyTransform() {
  const deltaY = currentY - startY;
  
  if (deltaY < 0) {
    // Natural upward lift curve
    const damping = Math.pow(Math.abs(deltaY), 0.96);
    lockScreen.style.transform = `translateY(-${damping}px)`;
  } else {
    // iOS Rubber-band resistance on down-pull
    const resistance = deltaY * 0.2;
    lockScreen.style.transform = `translateY(${resistance}px)`;
  }
  ticking = false;
}

// Touch Event Listeners
lockScreen.addEventListener('touchstart', (e) => {
  if (e.target.closest('.shortcut-btn') || e.target.closest('.passcode-container')) return;
  
  startY = e.touches[0].clientY;
  currentY = startY;
  startTime = performance.now();
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
  const timeElapsed = performance.now() - startTime;
  const velocityY = Math.abs(deltaY) / timeElapsed; // Velocity in px/ms
  
  // Apple Signature Spring Curve Easing
  lockScreen.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
  
  // Trigger unlock on 60px displacement or high upward flick velocity (>0.35 px/ms)
  if (deltaY < -60 || (deltaY < -15 && velocityY > 0.35)) {
    showPasscode();
    lockScreen.style.transform = 'translateY(0px)';
  } else {
    // Elastic spring back to home lock screen position
    lockScreen.style.transform = 'translateY(0px)';
  }
});

// Click fallback for testing on Desktop browsers
lockScreen.addEventListener('click', (e) => {
  if (!e.target.closest('.shortcut-btn') && !e.target.closest('.num-btn') && !e.target.closest('.text-action-btn')) {
    showPasscode();
  }
});

function showPasscode() {
  document.getElementById('passcode-container').classList.remove('hidden');
}

// Flashlight & Camera shortcut triggers
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

let isPlaying = false;
function togglePlay() {
  isPlaying = !isPlaying;
  const playBtn = document.getElementById('play-btn');
  if (playBtn) playBtn.textContent = isPlaying ? 'Pause' : 'Play';
}
