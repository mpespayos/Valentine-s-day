// script.js
let noClicks = 0;
let audioEnabled = false; // becomes true after user taps "Open"

const audio = {
  sad: null,
  happy: null,
  drumroll: null,
  cheer: null, 
  believer: null
};

function initAudio() {
  audio.sad = document.getElementById("audioSad");
  audio.happy = document.getElementById("audioHappy");
  audio.drumroll = document.getElementById("audioDrumroll");
  audio.cheer = document.getElementById("audioCheer");
  audio.believer = document.getElementById("audioBeliever");
}

function stopAllMusic() {
  [audio.sad, audio.happy, audio.drumroll, audio.cheer, audio.believer].forEach(a => {
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  });
}

function playLoop(track) {
  if (!audioEnabled) return;
  if (!track) return;
  stopAllMusic();
  track.volume = 0.6;
  track.play().catch(() => {});
}

function playCheer() {
  if (!audioEnabled) return;
  if (!audio.cheer) return;
  audio.cheer.volume = 0.85;
  audio.cheer.currentTime = 0;
  audio.cheer.play().catch(() => {});
}

document.addEventListener("DOMContentLoaded", () => {
  initAudio();
});

// Screen 0 -> 1 with audio permission
function openBook() {
  audioEnabled = true;        // user gesture unlocks audio on mobile
  nextScreen(1);              // go to Chapter 1
}

function nextScreen(num) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  document.getElementById('screen' + num).classList.add('active');

  // music by screen
  if (num === 1) playLoop(audio.sad);
  if (num === 2) playLoop(audio.happy);
  if (num === 3) playLoop(audio.drumroll);
  if (num === 4) playLoop(audio.believer);
  if (num === 0) stopAllMusic();

  // Reset NO behavior when returning to screen 3
  if (num === 3) {
    noClicks = 0;
    const noBtn = document.getElementById("noBtn");
    if (noBtn) {
      noBtn.style.position = "relative";
      noBtn.style.left = "0px";
      noBtn.style.top = "0px";
      noBtn.style.transform = "translate(0, 0)";
    }
  }

  // Reset photo frame when replaying
  if (num === 0) {
    const frameWrap = document.getElementById("frameWrap");
    if (frameWrap) frameWrap.hidden = true;
    clearSelfie();
  }
}

// FULLSCREEN spotlight takeover when YES choice is clicked (screen 3)
function wishTrue() {
  const img = document.getElementById("yesImg");
  const spot = document.getElementById("spotlight");
  const spotImg = document.getElementById("spotlightImg");

  stopAllMusic();
  playCheer();
  unlockTrack(audio.believer);

  if (!img || !spot || !spotImg) {
    nextScreen(4);
    return;
  }

  spotImg.src = img.src;
  spot.classList.add("show");

  setTimeout(() => {
    spot.classList.remove("show");
    nextScreen(4);
  }, 6500);
}

// "No" dodges inside the card for a few clicks, then escapes off-screen
function wishFalse() {
  const noBtn = document.getElementById("noBtn");
  const card = document.querySelector(".card");
  if (!noBtn || !card) return;

  noClicks++;

  if (noClicks <= 5) {
    noBtn.style.position = "relative";

    const cardRect = card.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const pad = 10;
    const maxX = Math.max(0, (cardRect.width - btnRect.width) - pad * 2);
    const maxY = 140;

    const x = pad + Math.random() * maxX;
    const y = (Math.random() * maxY) - (maxY / 2);

    noBtn.style.transform = `translate(${x}px, ${y}px)`;
    return;
  }

  noBtn.style.position = "fixed";
  noBtn.style.transform = "none";

  const off = 250;
  const side = Math.floor(Math.random() * 4);

  let left, top;

  if (side === 0) {
    left = window.innerWidth + off;
    top = Math.random() * (window.innerHeight - 60);
  } else if (side === 1) {
    left = -off;
    top = Math.random() * (window.innerHeight - 60);
  } else if (side === 2) {
    left = Math.random() * (window.innerWidth - 140);
    top = window.innerHeight + off;
  } else {
    left = Math.random() * (window.innerWidth - 140);
    top = -off;
  }

  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
}

// On the Valentine screen: after she says yes, reveal the photo frame + upload controls
function valentineYes() {
  confettiPop();
  const frameWrap = document.getElementById("frameWrap");
  if (frameWrap) frameWrap.hidden = false;
}

// Preview imported selfie inside the frame
document.addEventListener("change", (e) => {
  if (e.target && e.target.id === "selfieInput") {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);

    const img = document.getElementById("selfiePreview");
    const placeholder = document.getElementById("framePlaceholder");

    if (img) {
      img.src = url;
      img.style.display = "block";
    }
    if (placeholder) placeholder.style.display = "none";
  }
});

function clearSelfie() {
  const input = document.getElementById("selfieInput");
  const img = document.getElementById("selfiePreview");
  const placeholder = document.getElementById("framePlaceholder");

  if (input) input.value = "";
  if (img) {
    img.src = "";
    img.style.display = "none";
  }
  if (placeholder) placeholder.style.display = "grid";
}

// tiny confetti without libs
function confettiPop() {
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = Math.random() > 0.5 ? "💖" : "✨";
    s.style.position = "fixed";
    s.style.left = (window.innerWidth * 0.5 + (Math.random() - 0.5) * 160) + "px";
    s.style.top = (window.innerHeight * 0.5 + (Math.random() - 0.5) * 60) + "px";
    s.style.fontSize = (18 + Math.random() * 18) + "px";
    s.style.transition = "transform 700ms ease, opacity 700ms ease";
    s.style.opacity = "1";
    s.style.pointerEvents = "none";
    document.body.appendChild(s);

    requestAnimationFrame(() => {
      s.style.transform =
        `translate(${(Math.random()-0.5)*520}px, ${-200 - Math.random()*220}px) rotate(${(Math.random()-0.5)*220}deg)`;
      s.style.opacity = "0";
    });

    setTimeout(() => s.remove(), 800);
  }
}

function unlockTrack(track) {
  if (!audioEnabled || !track) return;

  const prevVol = track.volume;
  track.volume = 0;

  const p = track.play();
  if (p && typeof p.then === "function") {
    p.then(() => {
      track.pause();
      track.currentTime = 0;
      track.volume = prevVol;
    }).catch(() => {
      track.volume = prevVol;
    });
  } else {
    // fallback
    try {
      track.pause();
      track.currentTime = 0;
    } catch (_) {}
    track.volume = prevVol;
  }
}
