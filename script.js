// ===== FLOATING PARTICLES =====
const container = document.getElementById('particles');
const colors = ['#f4a7b9', '#e8d5f5', '#c2849a', '#e8c97e', '#9b72cf', '#fce4ec'];
const emojis = ['🌸', '✨', '💖', '🎀', '⭐', '🌷'];

for (let i = 0; i < 30; i++) {
  const el = document.createElement('div');
  const useEmoji = Math.random() > 0.5;
  if (useEmoji) {
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `position:absolute;font-size:${Math.random()*16+10}px;left:${Math.random()*100}%;animation:floatUp ${Math.random()*15+10}s linear infinite;animation-delay:-${Math.random()*15}s;pointer-events:none;`;
  } else {
    el.classList.add('particle');
    const size = Math.random() * 12 + 4;
    el.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:-${Math.random()*15}s;`;
  }
  container.appendChild(el);
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.wish-card, .slide, .video-item, .closing-card').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

const revealStyle = document.createElement('style');
revealStyle.textContent = `.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}.reveal.visible{opacity:1;transform:translateY(0)}`;
document.head.appendChild(revealStyle);

// ===== PHOTO SLIDER =====
const track     = document.getElementById('sliderTrack');
const dotsWrap  = document.getElementById('sliderDots');
const slides    = track.querySelectorAll('.slide');
const total     = slides.length;
let current     = 0;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  dot.setAttribute('aria-label', `Foto ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

const dots = dotsWrap.querySelectorAll('.dot');

function goTo(index) {
  current = (index + total) % total;
  slides[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.getElementById('prevSlide').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextSlide').addEventListener('click', () => goTo(current + 1));

// Sync dot on manual swipe
track.addEventListener('scroll', () => {
  const slideWidth = slides[0].offsetWidth + 16; // gap 1rem = 16px
  const idx = Math.round(track.scrollLeft / slideWidth);
  if (idx !== current) {
    current = idx;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
});

// Touch swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
});

// ===== MUSIC PLAYER =====
const playlist = [
  { src: 'music/Hindia - Cincin _ Lirik Lagu.mp3', title: 'Hindia — Cincin' },
  { src: 'music/Hindia - everything u are _ Lirik Lagu.mp3', title: 'Hindia — everything u are' }
];

let currentTrack = 0;
let isPlaying = false;

const audio       = document.getElementById('bgMusic');
const playBtn     = document.getElementById('playBtn');
const playIcon    = document.getElementById('playIcon');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const musicTitle  = document.getElementById('musicTitle');
const musicPlayer = document.getElementById('musicPlayer');

function loadTrack(index) {
  audio.src = playlist[index].src;
  musicTitle.textContent = playlist[index].title;
  audio.load();
}

function updateUI() {
  playIcon.textContent = isPlaying ? '⏸' : '▶';
  musicPlayer.classList.toggle('playing', isPlaying);
}

function play() {
  audio.play().then(() => { isPlaying = true; updateUI(); }).catch(() => {});
}

function pause() {
  audio.pause();
  isPlaying = false;
  updateUI();
}

playBtn.addEventListener('click', () => { isPlaying ? pause() : play(); });
prevBtn.addEventListener('click', () => { currentTrack = (currentTrack - 1 + playlist.length) % playlist.length; loadTrack(currentTrack); if (isPlaying) play(); });
nextBtn.addEventListener('click', () => { currentTrack = (currentTrack + 1) % playlist.length; loadTrack(currentTrack); if (isPlaying) play(); });
audio.addEventListener('ended', () => { currentTrack = (currentTrack + 1) % playlist.length; loadTrack(currentTrack); play(); });

loadTrack(currentTrack);
