// Global App state and navigation helpers
function openApp(appId) {
  const app = document.getElementById(appId);
  if (app) app.classList.add('active');
}

function closeApp() {
  const activeApps = document.querySelectorAll('.app-window.active');
  activeApps.forEach(app => app.classList.remove('active'));
}

// Capsule Switcher Logic (Years, Months, All)
function switchCapsule(button) {
  const tabs = document.querySelectorAll('.capsule-tab');
  tabs.forEach(tab => tab.classList.remove('active-capsule'));
  button.classList.add('active-capsule');
}

// Spotify Header Scroll Fade Effect
function handleSpotifyScroll() {
  const body = document.getElementById('spotify-body');
  const header = document.querySelector('.spotify-header');
  const title = document.getElementById('spotify-header-title');

  if (body.scrollTop > 40) {
    header.classList.add('scrolled');
    title.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    title.classList.remove('visible');
  }
}

// Photos Scroll Fade Effect
function handlePhotosScroll() {
  const body = document.getElementById('photos-body');
  const header = document.getElementById('photos-header');
  const title = document.getElementById('photos-header-title');

  if (body.scrollTop > 25) {
    header.classList.add('scrolled');
    title.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    title.classList.remove('visible');
  }
}

// Photos Viewer Logic
function openPhotoViewer(imageSrc) {
  const modal = document.getElementById('photo-viewer-modal');
  const viewerImg = document.getElementById('viewer-img');
  viewerImg.src = imageSrc;
  modal.classList.add('active');
}

function closePhotoViewer() {
  const modal = document.getElementById('photo-viewer-modal');
  modal.classList.remove('active');
}

// Robust Swipe Up & Drag to Unlock Logic
let startY = 0;
let currentY = 0;
let isTracking = false;
const lockScreen = document.getElementById('lock-screen');

if (lockScreen) {
  lockScreen.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    isTracking = true;
  }, { passive: true });

  lockScreen.addEventListener('touchmove', (e) => {
    if (!isTracking) return;
    currentY = e.touches[0].clientY;
    let diff = currentY - startY;
    if (diff < 0) {
      lockScreen.style.transform = `translateY(${diff}px)`;
    }
  }, { passive: true });

  lockScreen.addEventListener('touchend', (e) => {
    if (!isTracking) return;
    isTracking = false;
    let diff = currentY - startY;
    lockScreen.style.transform = '';
    if (diff < -30 || Math.abs(diff) < 5) {
      showPasscode();
    }
  });

  // Mouse support for desktop testing
  lockScreen.addEventListener('mousedown', (e) => {
    startY = e.clientY;
    isTracking = true;
  });

  lockScreen.addEventListener('mousemove', (e) => {
    if (!isTracking) return;
    currentY = e.clientY;
    let diff = currentY - startY;
    if (diff < 0) {
      lockScreen.style.transform = `translateY(${diff}px)`;
    }
  });

  lockScreen.addEventListener('mouseup', (e) => {
    if (!isTracking) return;
    isTracking = false;
    let diff = currentY - startY;
    lockScreen.style.transform = '';
    if (diff < -30 || Math.abs(diff) < 5) {
      showPasscode();
    }
  });
}

function handleLockScreenTap(e) {
  // Prevent triggering if clicking flashlight or camera shortcut buttons
  if (e.target.closest('.shortcut-btn')) return;
  showPasscode();
}

function showPasscode() {
  const passcodeContainer = document.getElementById('passcode-container');
  if (passcodeContainer) {
    passcodeContainer.classList.remove('hidden');
  }
}

// Passcode Logic
let enteredPasscode = '';
const correctPasscode = '1725';

function pressNum(num) {
  if (enteredPasscode.length < 4) {
    enteredPasscode += num;
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
  if (enteredPasscode === correctPasscode) {
    unlockPhone();
  } else {
    const container = document.getElementById('passcode-container');
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
      enteredPasscode = '';
      updateDots();
    }, 350);
  }
}

function unlockPhone() {
  const lockScreen = document.getElementById('lock-screen');
  const passcodeContainer = document.getElementById('passcode-container');
  lockScreen.classList.add('unlocked');
  passcodeContainer.classList.add('hidden');
  enteredPasscode = '';
  updateDots();
}

function cancelPasscode() {
  const passcodeContainer = document.getElementById('passcode-container');
  passcodeContainer.classList.add('hidden');
  enteredPasscode = '';
  updateDots();
}

// Lockscreen shortcuts
function toggleFlashlight(e) {
  e.currentTarget.classList.toggle('active');
}

function openCamera() {
  alert('Camera app simulated');
}
