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

  if (body.scrollTop > 35) {
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

// Real-time clock update
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const timeString = `${hours}:${minutes}`;
  
  const lockTime = document.getElementById('lock-time');
  const appClock = document.getElementById('app-clock-display');
  if (lockTime) lockTime.innerText = timeString;
  if (appClock) appClock.innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock();
