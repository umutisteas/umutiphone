// Global App state and navigation helpers
function openApp(appId) {
  const app = document.getElementById(appId);
  if (app) app.classList.add('active');
  if (appId === 'gallery-app') {
    initGalleryThumbnails();
  }
}

function closeApp() {
  // If photo viewer modal is active, close it first
  const photoViewer = document.getElementById('photo-viewer-modal');
  if (photoViewer && photoViewer.classList.contains('active')) {
    closePhotoViewer();
    return;
  }
  // Otherwise close any active app window to return to home screen
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

// List of realistic unique timestamps for each photo
const photoTimestamps = [
  { date: "Oct 10, 2026", time: "8:15 AM" },
  { date: "Yesterday", time: "11:32 AM" },
  { date: "Oct 28, 2026", time: "6:05 PM" },
  { date: "Oct 24, 2026", time: "1:20 PM" },
  { date: "Oct 19, 2026", time: "9:45 AM" },
  { date: "Oct 15, 2026", time: "3:50 PM" },
  { date: "Aug 21, 2026", time: "4:30 PM" },
  { date: "Sep 29, 2026", time: "5:22 PM" },
  { date: "Sep 22, 2026", time: "12:08 PM" },
  { date: "Sep 14, 2026", time: "10:40 AM" },
  { date: "Sep 05, 2026", time: "7:12 PM" },
  { date: "Aug 30, 2026", time: "2:55 PM" },
  { date: "Aug 14, 2026", time: "1:15 PM" },
  { date: "Aug 02, 2026", time: "6:45 PM" },
  { date: "Jul 25, 2026", time: "11:00 AM" },
  { date: "Jul 18, 2026", time: "3:33 PM" },
  { date: "Jul 10, 2026", time: "9:20 AM" },
  { date: "Jun 28, 2026", time: "5:45 PM" },
  { date: "Jun 19, 2026", time: "12:10 PM" },
  { date: "Jun 12, 2026", time: "8:50 AM" },
  { date: "Jun 01, 2026", time: "4:05 PM" },
  { date: "May 22, 2026", time: "2:30 PM" },
  { date: "May 14, 2026", time: "10:05 AM" },
  { date: "May 03, 2026", time: "6:20 PM" },
  { date: "Apr 20, 2026", time: "1:40 PM" },
  { date: "Apr 11, 2026", time: "11:55 AM" },
  { date: "Mar 30, 2026", time: "5:10 PM" },
  { date: "Mar 19, 2026", time: "9:30 AM" },
  { date: "Mar 08, 2026", time: "3:25 PM" },
  { date: "Feb 24, 2026", time: "12:50 PM" },
  { date: "Feb 14, 2026", time: "7:00 PM" },
  { date: "Jan 15, 2026", time: "4:15 PM" },
  { date: "Today", time: "4:14 PM" }
];

let allGalleryImages = [];

function initGalleryThumbnails() {
  const cards = document.querySelectorAll('.gallery-grid .photo-card');
  allGalleryImages = Array.from(cards).map(card => {
    let bg = card.style.backgroundImage;
    let match = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
    return match ? match[1] : '';
  }).filter(src => src !== '');

  const carousel = document.getElementById('ios-thumbnail-carousel');
  if (carousel && carousel.children.length === 0) {
    carousel.innerHTML = '';
    allGalleryImages.forEach((src, index) => {
      let thumb = document.createElement('div');
      thumb.className = 'carousel-thumb';
      thumb.style.backgroundImage = `url('${src}')`;
      thumb.onclick = () => selectPhotoByIndex(index);
      carousel.appendChild(thumb);
    });
  }
}

let currentPhotoIndex = 0;

function openPhotoViewer(imageSrc) {
  initGalleryThumbnails();
  currentPhotoIndex = allGalleryImages.indexOf(imageSrc);
  if (currentPhotoIndex === -1) currentPhotoIndex = 0;

  updateViewerDisplay();
  const modal = document.getElementById('photo-viewer-modal');
  modal.classList.add('active');
}

function selectPhotoByIndex(index) {
  currentPhotoIndex = index;
  updateViewerDisplay();
}

function updateViewerDisplay() {
  const viewerImg = document.getElementById('viewer-img');
  const dateTitle = document.getElementById('viewer-date-title');
  const dateTime = document.getElementById('viewer-date-time');

  viewerImg.src = allGalleryImages[currentPhotoIndex];

  // Assign unique timestamp per photo index
  const ts = photoTimestamps[currentPhotoIndex % photoTimestamps.length];
  dateTitle.textContent = ts.date;
  dateTime.textContent = ts.time;

  // Update active thumbnail in carousel
  const thumbs = document.querySelectorAll('.carousel-thumb');
  thumbs.forEach((t, i) => {
    if (i === currentPhotoIndex) {
      t.classList.add('active-thumb');
      t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } else {
      t.classList.remove('active-thumb');
    }
  });
}

function closePhotoViewer() {
  const modal = document.getElementById('photo-viewer-modal');
  modal.classList.remove('active');
}

function toggleFavorite(btn) {
  btn.classList.toggle('favorited');
  let svg = btn.querySelector('svg');
  if (btn.classList.contains('favorited')) {
    svg.setAttribute('fill', 'currentColor');
  } else {
    svg.setAttribute('fill', 'none');
  }
}

// Swipe Gesture Support for Photo Viewer (Left/Right photo switching)
let viewerStartX = 0;
let viewerEndX = 0;
const swipeArea = document.getElementById('viewer-swipe-area');

if (swipeArea) {
  swipeArea.addEventListener('touchstart', (e) => {
    viewerStartX = e.touches[0].clientX;
  }, { passive: true });

  swipeArea.addEventListener('touchend', (e) => {
    viewerEndX = e.changedTouches[0].clientX;
    handlePhotoSwipeGesture();
  });

  swipeArea.addEventListener('mousedown', (e) => {
    viewerStartX = e.clientX;
  });

  swipeArea.addEventListener('mouseup', (e) => {
    viewerEndX = e.clientX;
    handlePhotoSwipeGesture();
  });
}

function handlePhotoSwipeGesture() {
  let threshold = 40;
  const swipeAreaRect = swipeArea.getBoundingClientRect();
  // If swiped starting from right edge inside viewer, trigger close/home
  if ((viewerStartX - swipeAreaRect.left) >= (swipeAreaRect.width - 50)) {
    if (viewerStartX - viewerEndX > 30) {
      closeApp();
      return;
    }
  }

  if (viewerStartX - viewerEndX > threshold) {
    // Swiped Left -> Next Photo
    if (currentPhotoIndex < allGalleryImages.length - 1) {
      currentPhotoIndex++;
      updateViewerDisplay();
    }
  } else if (viewerEndX - viewerStartX > threshold) {
    // Swiped Right -> Previous Photo
    if (currentPhotoIndex > 0) {
      currentPhotoIndex--;
      updateViewerDisplay();
    }
  }
}

// Global App Window Swipe-from-Right Edge Support (to go back to Home Screen)
let appStartX = 0;
let appEndX = 0;

document.querySelectorAll('.app-window').forEach(win => {
  win.addEventListener('touchstart', (e) => {
    appStartX = e.touches[0].clientX;
  }, { passive: true });

  win.addEventListener('touchend', (e) => {
    appEndX = e.changedTouches[0].clientX;
    checkAppRightEdgeSwipe(win, appStartX, appEndX);
  });

  win.addEventListener('mousedown', (e) => {
    appStartX = e.clientX;
  });

  win.addEventListener('mouseup', (e) => {
    appEndX = e.clientX;
    checkAppRightEdgeSwipe(win, appStartX, appEndX);
  });
});

function checkAppRightEdgeSwipe(win, startX, endX) {
  const rect = win.getBoundingClientRect();
  const relativeStartX = startX - rect.left;
  const edgeThreshold = rect.width - 50;

  // Only trigger if started near the right edge of the app window and swiped left
  if (relativeStartX >= edgeThreshold && (startX - endX > 30)) {
    closeApp();
  }
}

// Reliable Lock Screen Unlock Logic (Swipe up or Tap to open passcode)
let lockStartY = 0;
let lockEndY = 0;
const lockScreen = document.getElementById('lock-screen');

if (lockScreen) {
  lockScreen.addEventListener('touchstart', (e) => {
    if (e.target.closest('.shortcut-btn')) return;
    lockStartY = e.touches[0].clientY;
  }, { passive: true });

  lockScreen.addEventListener('touchend', (e) => {
    if (e.target.closest('.shortcut-btn')) return;
    lockEndY = e.changedTouches[0].clientY;
    
    // If swiped up or just tapped/clicked, open passcode screen
    if (lockStartY - lockEndY > 20 || Math.abs(lockStartY - lockEndY) < 5) {
      showPasscode();
    }
  });

  lockScreen.addEventListener('mousedown', (e) => {
    if (e.target.closest('.shortcut-btn')) return;
    lockStartY = e.clientY;
  });

  lockScreen.addEventListener('mouseup', (e) => {
    if (e.target.closest('.shortcut-btn')) return;
    lockEndY = e.clientY;
    
    if (lockStartY - lockEndY > 20 || Math.abs(lockStartY - lockEndY) < 5) {
      showPasscode();
    }
  });
}

function handleLockScreenTap(e) {
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
