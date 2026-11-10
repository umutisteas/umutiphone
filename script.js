// Live Clock Update
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Open App Function
function openApp(appId) {
  const targetApp = document.getElementById(appId);
  if (targetApp) {
    targetApp.classList.add('active');
  }
}

// Close Active App Function
function closeApp() {
  const activeApps = document.querySelectorAll('.app-window.active');
  activeApps.forEach(app => app.classList.remove('active'));
}

// Simple Music Toggle Mockup
let isPlaying = false;
function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById('play-btn').textContent = isPlaying ? 'Pause' : 'Play';
}
