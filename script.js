// Global App state and navigation helpers
function openApp(appId) {
  const app = document.getElementById(appId);
  if (app) app.classList.add('active');
}

function closeApp() {
  const activeApps = document.querySelectorAll('.app-window.active');
  activeApps.forEach(app => app.classList.remove('active'));
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

// Swipe Up to Open Passcode / Unlock
let startY = 0;
let currentY = 0;
const lockScreen = document.getElementById('lock-screen');

if (lockScreen) {
  lockScreen.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  lockScreen.addEventListener('touchmove', (e) => {
    currentY = e.touches[0].clientY;
    let diff = currentY - startY;
    if (diff < 0) {
      lockScreen.style.transform = `translateY(${diff}px)`;
    }
  }, { passive: true });

  lockScreen.addEventListener('touchend', (e) => {
    let diff = currentY - startY;
    lockScreen.style.transform = '';
    if (diff < -40) {
      showPasscode();
    }
  });

  // Mouse support for desktop testing & backup click unlock
  let isMouseDown = false;
  lockScreen.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startY = e.clientY;
  });

  lockScreen.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    currentY = e.clientY;
    let diff = currentY - startY;
    if (diff < 0) {
      lockScreen.style.transform = `translateY(${diff}px)`;
    }
  });

  lockScreen.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    let diff = currentY - startY;
    lockScreen.style.transform = '';
    if (diff < -40) {
      showPasscode();
    }
  });
}

function handleLockScreenTap(e) {
  // Prevent triggering if clicking flashlight or camera shortcuts
  if (e.target.closest('.shortcut-btn')) return;
  // Fallback tap/click unlock
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
