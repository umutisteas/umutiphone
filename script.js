// --- Passcode & Lock Screen State ---
let passcodeEntered = "";
const correctPasscode = "1725"; // From settings app

function handleLockScreenTap(event) {
  // If passcode container is hidden, show it
  const passcodeContainer = document.getElementById("passcode-container");
  if (passcodeContainer.classList.contains("hidden")) {
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
  });
  closePhotoViewer();
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
  if (isPlaying) {
    playSvg.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
  } else {
    playSvg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
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
  const coverCard = document.getElementById("playlist-cover-card");
  const headerTitle = document.getElementById("spotify-header-title");
  const body = document.getElementById("spotify-body");
  
  if (coverCard && headerTitle && body) {
    if (body.scrollTop > 120) {
      headerTitle.style.opacity = "1";
    } else {
      headerTitle.style.opacity = "0";
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

// --- Instagram Stories Scroll Hide / Show Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const feedContainer = document.querySelector(".insta-feed-container");
  const storiesScroll = document.querySelector(".insta-stories-scroll");
  
  if (feedContainer && storiesScroll) {
    feedContainer.addEventListener("scroll", () => {
      let currentScroll = feedContainer.scrollTop;
      if (currentScroll > 20) {
        storiesScroll.style.maxHeight = "0px";
        storiesScroll.style.opacity = "0";
        storiesScroll.style.padding = "0 12px";
        storiesScroll.style.overflow = "hidden";
        storiesScroll.style.transition = "all 0.2s ease";
      } else {
        storiesScroll.style.maxHeight = "100px";
        storiesScroll.style.opacity = "1";
        storiesScroll.style.padding = "10px 12px";
        storiesScroll.style.transition = "all 0.2s ease";
      }
    });
  }
});
