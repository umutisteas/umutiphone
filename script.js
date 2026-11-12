// --- Passcode & Lock Screen State ---
let passcodeEntered = "";
const correctPasscode = "1725"; // From settings app

function handleLockScreenTap(event) {
  const passcodeContainer = document.getElementById("passcode-container");
  if (passcodeContainer && passcodeContainer.classList.contains("hidden")) {
    passcodeContainer.classList.remove("hidden");
  }
}

function pressNum(num) {
  if (passcodeEntered.length < 4) {
    passcodeEntered += num;
    updateDots();
    
    if (passcodeEntered.length === 4) {
      setTimeout(() => {
        if (passcodeEntered === correctPasscode) {
          unlockPhone();
        } else {
          alert("Incorrect passcode (try 1725)");
          passcodeEntered = "";
          updateDots();
        }
      }, 150);
    }
  }
}

function updateDots() {
  const dots = document.querySelectorAll(".dots-container .dot");
  dots.forEach((dot, index) => {
    if (index < passcodeEntered.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
}

function cancelPasscode() {
  passcodeEntered = "";
  updateDots();
  document.getElementById("passcode-container").classList.add("hidden");
}

function unlockPhone() {
  document.getElementById("lock-screen").classList.add("unlocked");
  const passcodeContainer = document.getElementById("passcode-container");
  if (passcodeContainer) {
    passcodeContainer.classList.add("hidden");
  }
}

function toggleFlashlight(e) {
  e.stopPropagation();
  alert("Flashlight toggled");
}

function openCamera() {
  alert("Camera opened");
}

// --- App Navigation ---
function openApp(appId) {
  const app = document.getElementById(appId);
  if (app) {
    app.classList.add("active");
  }
}

function closeApp() {
  const activeApps = document.querySelectorAll(".app-window.active");
  activeApps.forEach(app => {
    app.classList.remove("active");
    app.style.transform = "";
  });
  typeof closePhotoViewer === 'function' && closePhotoViewer();
}

// --- Real-time Clock & Date ---
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  const timeStr = `${hours}:${minutes}`;
  
  const lockTime = document.getElementById("lock-time");
  if (lockTime) lockTime.innerText = timeStr;
  
  const appClock = document.getElementById("app-clock-display");
  if (appClock) appClock.innerText = timeStr;

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  const lockDate = document.getElementById("lock-date");
  if (lockDate) lockDate.innerText = dateStr;
}
setInterval(updateClock, 1000);
updateClock();

// --- Spotify Player Logic ---
let isPlaying = true;
function togglePlay() {
  isPlaying = !isPlaying;
  const playSvg = document.getElementById("main-play-svg");
  if (playSvg) {
    if (isPlaying) {
      playSvg.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
    } else {
      playSvg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
  }
}

function toggleShuffle(btn) {
  btn.classList.toggle("active");
}

function playSong(index) {
  isPlaying = true;
  const playSvg = document.getElementById("main-play-svg");
  if (playSvg) {
    playSvg.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
  }
}

function handleSpotifyScroll() {
  const header = document.querySelector(".spotify-header");
  const headerTitle = document.getElementById("spotify-header-title");
  const body = document.getElementById("spotify-body");
  
  if (header && body) {
    if (body.scrollTop > 80) {
      header.classList.add("scrolled");
      if (headerTitle) headerTitle.style.opacity = "1";
    } else {
      header.classList.remove("scrolled");
      if (headerTitle) headerTitle.style.opacity = "0";
    }
  }
}

// --- Photos App Logic ---
function handlePhotosScroll() {
  const header = document.getElementById("photos-header");
  const body = document.getElementById("photos-body");
  if (header && body) {
    if (body.scrollTop > 40) {
      header.classList.add("visible");
    } else {
      header.classList.remove("visible");
    }
  }
}

function openPhotoViewer(imgSrc) {
  const modal = document.getElementById("photo-viewer-modal");
  const viewerImg = document.getElementById("viewer-img");
  if (modal && viewerImg) {
    viewerImg.src = imgSrc;
    modal.classList.add("active");
    buildThumbnails(imgSrc);
  }
}

function closePhotoViewer() {
  const modal = document.getElementById("photo-viewer-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function toggleFavorite(btn) {
  btn.style.color = btn.style.color === "rgb(255, 48, 64)" ? "#fff" : "#ff3040";
}

function switchCapsule(tab) {
  document.querySelectorAll(".capsule-tab").forEach(t => t.classList.remove("active-capsule"));
  tab.classList.add("active-capsule");
}

function buildThumbnails(activeSrc) {
  const carousel = document.getElementById("ios-thumbnail-carousel");
  if (!carousel) return;
  
  const photoCards = document.querySelectorAll(".photo-card");
  carousel.innerHTML = "";
  
  photoCards.forEach(card => {
    const bgImage = card.style.backgroundImage;
    const match = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      const src = match[1];
      const thumb = document.createElement("div");
      thumb.className = "thumb-item" + (src === activeSrc ? " active-thumb" : "");
      thumb.style.backgroundImage = `url('${src}')`;
      thumb.onclick = () => {
        document.getElementById("viewer-img").src = src;
        document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active-thumb"));
        thumb.classList.add("active-thumb");
      };
      carousel.appendChild(thumb);
    }
  });
}

// --- Smooth Lock Screen Swipe/Drag Unlock ---
document.addEventListener("DOMContentLoaded", () => {
  const lockScreen = document.getElementById("lock-screen");
  if (!lockScreen) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  lockScreen.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  lockScreen.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    let diff = currentY - startY;
    if (diff < 0) {
      lockScreen.style.transform = `translateY(${diff}px)`;
    }
  }, { passive: true });

  lockScreen.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    let diff = currentY - startY;
    if (diff < -30) {
      const passcodeContainer = document.getElementById("passcode-container");
      if (passcodeContainer) {
        passcodeContainer.classList.remove("hidden");
      }
      lockScreen.style.transform = "";
    } else {
      lockScreen.style.transform = "";
    }
  });

  lockScreen.addEventListener("mousedown", (e) => {
    startY = e.clientY;
    isDragging = true;
  });

  lockScreen.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    currentY = e.clientY;
    let diff = currentY - startY;
    if (diff < 0) {
      lockScreen.style.transform = `translateY(${diff}px)`;
    }
  });

  lockScreen.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    let diff = currentY - startY;
    if (diff < -30) {
      const passcodeContainer = document.getElementById("passcode-container");
      if (passcodeContainer) {
        passcodeContainer.classList.remove("hidden");
      }
      lockScreen.style.transform = "";
    } else {
      lockScreen.style.transform = "";
    }
  });
});

// --- Edge Swipe Gesture to Go Back / Close App ---
document.addEventListener("DOMContentLoaded", () => {
  const phoneScreen = document.querySelector(".phone-screen");
  if (!phoneScreen) return;

  let startX = 0;
  let currentX = 0;
  let isEdgeSwiping = false;

  phoneScreen.addEventListener("touchstart", (e) => {
    const activeApp = document.querySelector(".app-window.active");
    if (activeApp) {
      startX = e.touches[0].clientX;
      const screenRect = phoneScreen.getBoundingClientRect();
      const distFromLeft = startX - screenRect.left;
      const distFromRight = screenRect.right - startX;
      
      if (distFromLeft < 40 || distFromRight < 40) {
        isEdgeSwiping = true;
      }
    }
  }, { passive: true });

  phoneScreen.addEventListener("touchmove", (e) => {
    if (!isEdgeSwiping) return;
    currentX = e.touches[0].clientX;
    let diff = currentX - startX;
    const activeApp = document.querySelector(".app-window.active");
    if (activeApp) {
      activeApp.style.transform = `translateX(${diff}px)`;
      activeApp.style.transition = "none";
    }
  }, { passive: true });

  phoneScreen.addEventListener("touchend", (e) => {
    if (!isEdgeSwiping) return;
    isEdgeSwiping = false;
    let diff = currentX - startX;
    const activeApp = document.querySelector(".app-window.active");
    if (activeApp) {
      activeApp.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      if (Math.abs(diff) > 70) {
        closeApp();
        activeApp.style.transform = "";
      } else {
        activeApp.style.transform = "";
      }
    }
  });
});
