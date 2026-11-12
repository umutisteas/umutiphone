// Database of your exact notes content (First line acts as the bold title)
const notesData = {
  'note-7d-1': `Hays

Carrots
Patatas
Giniling
Aji ginisa
Mantika
Sibuyas
Asin
Paminta`,

  'note-7d-2': `Kssiskwkw

Ang tagal mag december gusto ko na makipag simbang gabi date kay Rui tapos bg song ng story ko sa kanya ‘Alas Dose’ PUTANGINA KINIKILIG AKO`,

  'note-7d-3': `i love filipino films

Bekikang
Im drunk ily 🔥😭😭💔💔💔
Vice ganda films
Bambanti
Fangirl
Sunshine
Pamilya ordinaryo
Respeto
Cleaners
Babae at baril
Ekstra
Ang dalawang Mrs. Reyes
Call center girl
Oda sa wala
Becky & badette`,

  'note-30d-1': `annivch

Happy 4th anniversary to the person who holds my whole heart. When I look back, it feels both like time has flown by in the blink of an eye and like we've lived a whole lifetime of beautiful moments together —from our spontaneous laughs to the quiet, ordinary days that somehow became my absolute favorites. Thank you for being my constant, for the safety I find in your arms, and for making even the hardest days feel lighter just by being in my corner; loving you is the easiest and most natural thing I have ever known.

Four years is a wonderful milestone, but looking ahead, it feels like we are still just getting started. I am so endlessly grateful for the history we've built, and I am even more excited for all the unspoken tomorrows, future adventures, and quiet mornings waiting for us. Here's to four years of us, to the love we share, and to a lifetime more of growing side by side.`,

  'note-30d-2': `sched ni bhoszx

This month 
13 - bday ng pamangkin 
19 - side quest event
20 - side quest event
24 to 26 - baguio kasama mga mababaho
27 - bed rotting kasama ang asana
31 - uwi sa bahay (mag shopping)`,

  'note-30d-3': `vacant

Tangina boring tapos ang hina pa ng globe sa school HAYOP NA YAN (imy bf)`,

  'note-30d-4': `isisisisiskcjjf

Swerte mo kung mapag bibigyan, ingatan mo ang pag ibig ng isang KAKAIBABE KAKAIBABE KAKAIBABE KAKAIBABE pag natagpuan wag pakawalan`,

  'note-30d-5': `rui

Pano b i flames name namin? Hays pina flames ko name ni rui tyaka ng pres nila LOVERS daw putangina nakakapikon`
};

function openNoteDetail(noteId) {
  const rawContent = notesData[noteId] || "No content found.";
  const parts = rawContent.split('\n');
  const title = parts[0] || '';
  const body = parts.slice(1).join('\n').trim();

  const container = document.getElementById('note-content-container');
  container.innerHTML = `<div class="note-title-bold">${title}</div><div class="note-body-text">${body}</div>`;
  
  document.getElementById('notes-list-view').classList.remove('active-view');
  document.getElementById('note-detail-view').classList.add('active-view');
}

function closeNoteDetail() {
  document.getElementById('note-detail-view').classList.remove('active-view');
  document.getElementById('notes-list-view').classList.add('active-view');
}

function openApp(appId) {
  const target = document.getElementById(appId);
  if (target) {
    target.classList.add('active');
  }
}

function closeApp() {
  const activeApps = document.querySelectorAll('.app-window.active');
  activeApps.forEach(app => {
    app.classList.add('slide-out-right');
    setTimeout(() => {
      app.classList.remove('active', 'slide-out-right');
    }, 300);
  });
}

// Swipe Gesture Handler for Lock Screen & App Closing
let touchStartY = 0;
let touchStartX = 0;
let currentActiveApp = null;

document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  currentActiveApp = document.querySelector('.app-window.active');
}, { passive: true });

document.addEventListener('touchend', e => {
  let touchEndY = e.changedTouches[0].clientY;
  let touchEndX = e.changedTouches[0].clientX;
  
  let diffY = touchStartY - touchEndY; 
  let diffX = touchEndX - touchStartX; 

  // 1. Swipe UP on Lock Screen to open Passcode
  const lockScreen = document.getElementById('lock-screen');
  const passcodeContainer = document.getElementById('passcode-container');
  if (lockScreen && !lockScreen.classList.contains('unlocked') && passcodeContainer) {
    if (diffY > 50 && Math.abs(diffX) < 50) {
      passcodeContainer.classList.remove('hidden');
    }
  }

  // 2. Swipe RIGHT to close active App and return to Home Screen
  if (currentActiveApp && diffX > 80 && Math.abs(diffY) < 60) {
    closeApp();
  }
}, { passive: true });

let passcodeEntered = "";
const correctPasscode = "1725";

function pressNum(num) {
  if (passcodeEntered.length < 4) {
    passcodeEntered += num;
    updateDots();
    
    if (passcodeEntered.length === 4) {
      setTimeout(() => {
        if (passcodeEntered === correctPasscode) {
          const lockScreen = document.getElementById('lock-screen');
          if (lockScreen) {
            lockScreen.classList.add('unlocked');
          }
        } else {
          alert("Incorrect passcode! (Hint: 1725)");
          passcodeEntered = "";
          updateDots();
        }
      }, 150);
    }
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index < passcodeEntered.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

function cancelPasscode() {
  passcodeEntered = "";
  updateDots();
  const passcodeContainer = document.getElementById('passcode-container');
  if (passcodeContainer) {
    passcodeContainer.classList.add('hidden');
  }
}

function toggleFlashlight(e) {
  e.stopPropagation();
  alert("Flashlight toggled");
}

function openCamera() {
  alert("Camera app opened");
}

function toggleShuffle(btn) {
  btn.classList.toggle('active');
}

function togglePlay() {
  const svg = document.getElementById('main-play-svg');
  if (svg) {
    if (svg.innerHTML.includes('rect')) {
      svg.innerHTML = '<polygon points="5,3 19,12 5,21" fill="#000000"/>';
    } else {
      svg.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
    }
  }
}

function playSong(index) {
  alert("Playing track index: " + index);
}

function handleSpotifyScroll() {
  const header = document.querySelector('.spotify-header');
  const title = document.getElementById('spotify-header-title');
  const body = document.getElementById('spotify-body');
  if (header && title && body) {
    if (body.scrollTop > 120) {
      header.classList.add('scrolled');
      title.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      title.classList.remove('visible');
    }
  }
}

function handlePhotosScroll() {
  const header = document.getElementById('photos-header');
  const title = document.getElementById('photos-header-title');
  const body = document.getElementById('photos-body');
  if (header && title && body) {
    if (body.scrollTop > 50) {
      header.classList.add('scrolled');
      title.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      title.classList.remove('visible');
    }
  }
}

function switchCapsule(btn) {
  document.querySelectorAll('.capsule-tab').forEach(tab => tab.classList.remove('active-capsule'));
  btn.classList.add('active-capsule');
}

function openPhotoViewer(imgSrc) {
  const modal = document.getElementById('photo-viewer-modal');
  const viewerImg = document.getElementById('viewer-img');
  if (modal && viewerImg) {
    viewerImg.src = imgSrc;
    modal.classList.add('active');
  }
}

function closePhotoViewer() {
  const modal = document.getElementById('photo-viewer-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function toggleFavorite(btn) {
  btn.classList.toggle('favorited');
  const svg = btn.querySelector('svg');
  if (svg) {
    if (btn.classList.contains('favorited')) {
      svg.setAttribute('fill', '#ff2d55');
      svg.setAttribute('stroke', '#ff2d55');
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
    }
  }
}
