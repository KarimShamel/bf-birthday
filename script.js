/* ================================================================
   BIRTHDAY SURPRISE — script.js
   Uses: Three.js (r128), GSAP 3 + ScrollTrigger
   ================================================================ */

"use strict";

/* ----------------------------------------------------------------
   ⚙️  CONFIG — Edit these to personalise the experience
---------------------------------------------------------------- */
const CONFIG = {
  // Answer to the secret question (any format you like)
  secretAnswer: "14/02/2023",

  // Photos to show in the gallery (add as many as you like)
  galleryPhotos: [
    "photos/photo1.jpg",
    "photos/photo2.jpg",
    "photos/photo3.jpg",
    "photos/photo4.jpg",
    "photos/photo5.jpg",
    "photos/photo6.jpg",
    "photos/photo7.jpg",
    "photos/photo8.jpg",
    "photos/photo9.jpg",
  ],

  // Extra hidden photos unlocked by the secret
  secretPhotos: [
    "photos/secret1.jpg",
    "photos/secret2.jpg",
    "photos/secret3.jpg",
  ],

  // Score needed to win the mini-game
  gameTargetScore: 15,

  // Game duration in seconds
  gameDuration: 60,
};

/* ----------------------------------------------------------------
   REASONS CARDS
---------------------------------------------------------------- */
const REASONS = [
  { icon: "😊", front: "Your Smile",    back: "It lights up every room and every corner of my heart." },
  { icon: "💛", front: "Your Kindness", back: "You give so gently, without even realising it." },
  { icon: "😂", front: "Your Laugh",    back: "The most beautiful sound I've ever heard." },
  { icon: "🤗", front: "Your Hugs",     back: "They make every bad day instantly better." },
  { icon: "🧠", front: "Your Mind",     back: "Brilliant, curious, endlessly fascinating." },
  { icon: "💪", front: "Your Strength", back: "You carry so much and still make it look graceful." },
  { icon: "🌙", front: "Your Patience", back: "You never rush me — you just wait, warmly." },
  { icon: "✨", front: "Your Spark",    back: "That energy you bring to everything you touch." },
  { icon: "📚", front: "Your Passion",  back: "Watching you love what you love makes me love you more." },
  { icon: "🌹", front: "Your Beauty",   back: "Inside and out — completely breathtaking." },
  { icon: "🎵", front: "Your Voice",    back: "Even in silence, I hear it in my head." },
  { icon: "🍳", front: "You in the Kitchen", back: "The way you make even cooking feel like love." },
  { icon: "🤝", front: "Your Loyalty",  back: "You stay — through everything — and that means the world." },
  { icon: "😴", front: "Sleepy You",    back: "The softest, most precious version of you." },
  { icon: "🌟", front: "Your Dreams",   back: "I love watching you chase them. I'll always cheer loudest." },
  { icon: "🎨", front: "Your Creativity", back: "The way you see the world is unlike anyone else." },
  { icon: "🌊", front: "Your Calm",     back: "In chaos, you are my anchor." },
  { icon: "🏡", front: "Home",          back: "Wherever you are is exactly where I belong." },
  { icon: "🌈", front: "Your Hope",     back: "Even on grey days, you find the colour." },
  { icon: "💞", front: "All of You",    back: "Every single piece — I love it all, unconditionally." },
];

/* ----------------------------------------------------------------
   BIRTHDAY WISHES
---------------------------------------------------------------- */
const WISHES = [
  { msg: "May today be as magical as you make every ordinary day.", from: "With all my love ❤️" },
  { msg: "You deserve every beautiful thing this world has to offer.", from: "Your biggest fan" },
  { msg: "Happy Birthday to the person who stole my heart completely.", from: "Yours always" },
  { msg: "Growing older with you is the only adventure I'll ever need.", from: "Forever yours" },
  { msg: "Today the universe celebrates the day you were born.", from: "And so do I ❤️" },
  { msg: "You are the best thing that has ever happened to me.", from: "No question about it" },
];

/* ----------------------------------------------------------------
   LOVE LETTER
---------------------------------------------------------------- */
const LETTER = `My love,

There are days when I look at you and feel something so enormous
I don't know what to do with it — so I keep it here, in this letter,
just for you.

You have no idea how much light you bring into my world.
How your laugh can undo every bad thing about a difficult day.
How the thought of you — just the thought — makes everything easier.

I love you in the quiet moments. In the loud ones.
In the moments you think no one is watching. In all of them.

On your birthday, I don't want to just say 'Happy Birthday.'
I want to say: thank you. Thank you for being exactly who you are.
Thank you for choosing me, again and again.

You are the greatest story I have ever been a part of,
and I cannot wait to see every chapter that comes next.

Forever and always yours ❤️`;

/* ================================================================
   SPARKLE CANVAS (behind curtains)
================================================================ */
(function initSparkles() {
  const canvas = document.getElementById("sparkle-canvas");
  const ctx    = canvas.getContext("2d");
  let W, H, sparks = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 80; i++) sparks.push(newSpark());

  function newSpark() {
    return {
      x: Math.random() * (window.innerWidth  || 1000),
      y: Math.random() * (window.innerHeight || 800),
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
      brightness: Math.random(),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    sparks.forEach(s => {
      s.brightness += Math.sin(Date.now() * s.speed) * 0.02;
      const alpha = Math.max(0.1, Math.abs(Math.sin(Date.now() * s.speed)));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${alpha.toFixed(2)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ================================================================
   CURTAIN + OPEN BUTTON
================================================================ */
const audio = document.getElementById("bg-music");

document.getElementById("open-btn").addEventListener("click", () => {
  // Try to play audio (may be blocked by browser until user gesture ✓)
  audio.play().catch(() => {});

  // Explosion of confetti
  launchConfetti();

  // Animate curtains open with GSAP
  gsap.to("#curtain-left",  { x: "-100%", duration: 2.2, ease: "power2.inOut" });
  gsap.to("#curtain-right", { x:  "100%", duration: 2.2, ease: "power2.inOut" });

  // Fade curtain text
  gsap.to("#curtain-text", { opacity: 0, duration: 0.8 });

  // After curtains fully open, show main experience
  gsap.delayedCall(2.4, () => {
    document.getElementById("curtain-scene").style.display = "none";
    const main = document.getElementById("main-experience");
    main.classList.remove("hidden");
    gsap.from(main, { opacity: 0, duration: 1 });
    initHeroAnimations();
    initParticles();
    initHeroThree();
    initShowcaseThree();
    initFinaleThree();
    initFireworks();
    ScrollTrigger.refresh();
  });
});

/* ================================================================
   CONFETTI
================================================================ */
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx    = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ["#f9a8d4","#fde68a","#C9A84C","#B5526B","#ffffff","#a5b4fc"];

  for (let i = 0; i < 250; i++) {
    pieces.push({
      x: canvas.width  * 0.5 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 1.5) * 14,
      r: Math.random() * 7 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.3,
      life:  1,
    });
  }

  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    const t = (ts - start) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let any = false;
    pieces.forEach(p => {
      p.vy += 0.35;  // gravity
      p.x  += p.vx;
      p.y  += p.vy;
      p.angle += p.spin;
      p.life = Math.max(0, 1 - t / 4);
      if (p.life <= 0) return;
      any = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 2.5);
      ctx.restore();
    });

    if (any) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}

/* ================================================================
   FLOATING PARTICLES
================================================================ */
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx    = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.5 - 0.1,
    r:  Math.random() * 2 + 0.5,
    a:  Math.random(),
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < 0) { p.y = H; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242,196,206,${(p.a * 0.4).toFixed(2)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ================================================================
   HERO ANIMATIONS (GSAP)
================================================================ */
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(".hero-eyebrow",  { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" })
    .to(".hero-title",    { opacity: 1, y: 0, duration: 1,   ease: "power2.out" }, "-=0.5")
    .to(".hero-message",  { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.5")
    .to(".scroll-cta",    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");

  // Scroll-triggered timeline items
  document.querySelectorAll(".tl-item[data-aos]").forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => el.classList.add("visible"),
    });
  });
}

/* ================================================================
   THREE.JS — HERO HEART
================================================================ */
function initHeroThree() {
  const container = document.getElementById("three-container");
  const W = container.clientWidth  || window.innerWidth;
  const H = container.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Ambient + directional lights
  scene.add(new THREE.AmbientLight(0xfff0f5, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffc0cb, 1.5);
  dirLight.position.set(3, 5, 5);
  scene.add(dirLight);
  const pinkLight = new THREE.PointLight(0xB5526B, 2, 10);
  pinkLight.position.set(-2, 1, 3);
  scene.add(pinkLight);
  const goldLight = new THREE.PointLight(0xC9A84C, 1.5, 10);
  goldLight.position.set(2, -1, 3);
  scene.add(goldLight);

  // Procedural heart shape (no external model needed)
  const heartShape = new THREE.Shape();
  const x = 0, y = 0;
  heartShape.moveTo(x + 0.5, y + 0.5);
  heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y,      x, y);
  heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
  heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
  heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
  heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
  heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

  const extrudeSettings = { depth: 0.35, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  geometry.center();

  const material = new THREE.MeshPhongMaterial({
    color: 0xB5526B,
    emissive: 0x3A0510,
    emissiveIntensity: 0.4,
    shininess: 80,
    specular: 0xffc0cb,
  });

  const heart = new THREE.Mesh(geometry, material);
  heart.rotation.x = Math.PI;
  scene.add(heart);

  // Glow particles around heart
  const particleGeo = new THREE.BufferGeometry();
  const pCount = 200;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 1.4 + Math.random() * 0.8;
    pPos[i * 3]     = Math.cos(theta) * r;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
    pPos[i * 3 + 2] = Math.sin(theta) * r;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0xF2C4CE, size: 0.04, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(particleGeo, particleMat));

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener("mousemove", e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Rotate + pulse
    heart.rotation.y = t * 0.5 + mouseX * 0.5;
    heart.rotation.x = Math.PI + mouseY * 0.3;
    const pulse = 1 + 0.06 * Math.sin(t * 2.4);
    heart.scale.set(pulse, pulse, pulse);

    // Pulsing glow
    pinkLight.intensity = 1.5 + Math.sin(t * 2.4) * 0.8;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener("resize", () => {
    const nW = container.clientWidth  || window.innerWidth;
    const nH = container.clientHeight || window.innerHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
}

/* ================================================================
   GALLERY — MASONRY + LIGHTBOX
================================================================ */
(function initGallery() {
  const grid = document.getElementById("masonry-grid");

  // Build gallery items
  CONFIG.galleryPhotos.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Memory ${i + 1}`;
    img.loading = "lazy";
    // Fallback colour if image doesn't load
    const palette = ["#f9a8d4","#fde68a","#a5b4fc","#6ee7b7","#fcd34d","#c4b5fd","#fbcfe8","#bfdbfe","#d1fae5"];
    img.style.background = palette[i % palette.length];
    img.style.minHeight = "120px";
    item.appendChild(img);
    item.addEventListener("click", () => openLightbox(i));
    grid.appendChild(item);
  });

  // Lightbox
  const lb      = document.getElementById("lightbox");
  const lbImg   = document.getElementById("lb-img");
  const lbCtr   = document.getElementById("lb-counter");
  let current   = 0;

  function openLightbox(idx) {
    current = idx;
    lbImg.src = CONFIG.galleryPhotos[idx];
    lbCtr.textContent = `${idx + 1} / ${CONFIG.galleryPhotos.length}`;
    lb.classList.remove("hidden");
  }

  document.getElementById("lb-close").addEventListener("click", () => lb.classList.add("hidden"));
  document.getElementById("lb-prev").addEventListener("click",  () => {
    current = (current - 1 + CONFIG.galleryPhotos.length) % CONFIG.galleryPhotos.length;
    openLightbox(current);
  });
  document.getElementById("lb-next").addEventListener("click",  () => {
    current = (current + 1) % CONFIG.galleryPhotos.length;
    openLightbox(current);
  });

  document.addEventListener("keydown", e => {
    if (lb.classList.contains("hidden")) return;
    if (e.key === "Escape")      lb.classList.add("hidden");
    if (e.key === "ArrowLeft")   { current = (current - 1 + CONFIG.galleryPhotos.length) % CONFIG.galleryPhotos.length; openLightbox(current); }
    if (e.key === "ArrowRight")  { current = (current + 1) % CONFIG.galleryPhotos.length; openLightbox(current); }
  });
})();

/* ================================================================
   REASONS CARDS
================================================================ */
(function initReasons() {
  const grid = document.getElementById("reasons-grid");
  REASONS.forEach(r => {
    const card = document.createElement("div");
    card.className = "reason-card";
    card.innerHTML = `
      <div class="reason-inner">
        <div class="reason-front">
          <span class="reason-icon">${r.icon}</span>
          <span>${r.front}</span>
        </div>
        <div class="reason-back">
          <p>${r.back}</p>
        </div>
      </div>`;
    grid.appendChild(card);
  });
})();

/* ================================================================
   LOVE LETTER — envelope + typewriter
================================================================ */
(function initLetter() {
  const envelope = document.getElementById("envelope");
  const letterTxt = document.getElementById("letter-text");
  let opened = false;

  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    envelope.querySelector(".env-hint") && (envelope.closest("#envelope-wrap").querySelector(".env-hint").style.opacity = "0");

    // Typewriter after letter slides out
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        letterTxt.textContent += LETTER[i];
        i++;
        if (i >= LETTER.length) clearInterval(interval);
      }, 22);
    }, 1400);
  });
})();

/* ================================================================
   HEART GARDEN
================================================================ */
(function initGarden() {
  const area = document.getElementById("garden-area");

  area.addEventListener("click", e => {
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnHeart(area, x, y);
  });

  area.addEventListener("touchstart", e => {
    Array.from(e.touches).forEach(t => {
      const rect = area.getBoundingClientRect();
      spawnHeart(area, t.clientX - rect.left, t.clientY - rect.top);
    });
  }, { passive: true });

  function spawnHeart(parent, x, y) {
    const hearts = ["❤️","💕","💗","💖","💝","🩷"];
    const el = document.createElement("div");
    el.className = "floating-heart";
    el.style.left = (x - 18) + "px";
    el.style.top  = (y - 18) + "px";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    parent.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
})();

/* ================================================================
   WISHES WALL
================================================================ */
(function initWishes() {
  const container = document.getElementById("bubbles-container");

  WISHES.forEach((w, i) => {
    const bubble = document.createElement("div");
    bubble.className = "wish-bubble";

    // Spread them around
    const cols = 3;
    const colW = 33;
    const col  = i % cols;
    const row  = Math.floor(i / cols);
    bubble.style.left  = (col  * colW + Math.random() * 8) + "%";
    bubble.style.top   = (row  * 200 + Math.random() * 40) + "px";
    bubble.style.animationDelay = (i * 0.7) + "s";
    bubble.style.animationDuration = (7 + Math.random() * 4) + "s";

    bubble.innerHTML = `<p>"${w.msg}"</p><span>— ${w.from}</span>`;
    container.appendChild(bubble);
  });

  // Dynamic height
  const rows = Math.ceil(WISHES.length / 3);
  container.style.minHeight = (rows * 210 + 80) + "px";
})();

/* ================================================================
   THREE.JS — 3D HEART SHOWCASE
================================================================ */
function initShowcaseThree() {
  const container = document.getElementById("showcase-three");
  const W = container.clientWidth  || 800;
  const H = container.clientHeight || 500;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 6);

  scene.add(new THREE.AmbientLight(0xfff0f5, 0.5));
  const dl = new THREE.DirectionalLight(0xffc0cb, 1.8);
  dl.position.set(4, 6, 4);
  scene.add(dl);
  const pL = new THREE.PointLight(0xB5526B, 3, 12);
  pL.position.set(0, 0, 4);
  scene.add(pL);

  // Reuse heart geometry
  const heartShape = makeHeartShape();
  const geo = new THREE.ExtrudeGeometry(heartShape, { depth: 0.5, bevelEnabled: true, bevelSegments: 8, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 });
  geo.center();
  const mat = new THREE.MeshPhongMaterial({ color: 0xB5526B, emissive: 0x4A0A18, emissiveIntensity: 0.5, shininess: 100, specular: 0xffaabb });
  const heart = new THREE.Mesh(geo, mat);
  heart.rotation.x = Math.PI;
  scene.add(heart);

  // Orbit-like rotation via mouse drag
  let dragging = false, prevMouse = { x: 0, y: 0 }, rotY = 0, rotX = 0;
  renderer.domElement.addEventListener("mousedown",  e => { dragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener("mouseup",    () => dragging = false);
  renderer.domElement.addEventListener("mouseleave", () => dragging = false);
  renderer.domElement.addEventListener("mousemove",  e => {
    if (!dragging) return;
    rotY += (e.clientX - prevMouse.x) * 0.01;
    rotX += (e.clientY - prevMouse.y) * 0.01;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  // Touch
  let lastTouch = null;
  renderer.domElement.addEventListener("touchstart", e => { lastTouch = e.touches[0]; }, { passive: true });
  renderer.domElement.addEventListener("touchmove",  e => {
    if (!lastTouch) return;
    rotY += (e.touches[0].clientX - lastTouch.clientX) * 0.01;
    rotX += (e.touches[0].clientY - lastTouch.clientY) * 0.01;
    lastTouch = e.touches[0];
  }, { passive: true });

  // Zoom via scroll
  renderer.domElement.addEventListener("wheel", e => {
    camera.position.z = Math.max(3, Math.min(12, camera.position.z + e.deltaY * 0.01));
  }, { passive: true });

  // Particle trail
  const trailGeo = new THREE.BufferGeometry();
  const tCount = 300;
  const tPos = new Float32Array(tCount * 3);
  for (let i = 0; i < tCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r     = 1.8 + Math.random() * 1.2;
    tPos[i * 3]     = Math.cos(angle) * r;
    tPos[i * 3 + 1] = (Math.random() - 0.5) * 3;
    tPos[i * 3 + 2] = Math.sin(angle) * r;
  }
  trailGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
  const trailMat = new THREE.PointsMaterial({ color: 0xF2C4CE, size: 0.05, transparent: true, opacity: 0.5 });
  const trail = new THREE.Points(trailGeo, trailMat);
  scene.add(trail);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Auto-rotate when not dragging
    if (!dragging) rotY += 0.006;
    heart.rotation.y = rotY;
    heart.rotation.x = Math.PI + rotX;

    const pulse = 1 + 0.07 * Math.sin(t * 2.2);
    heart.scale.set(pulse, pulse, pulse);
    pL.intensity = 2.5 + Math.sin(t * 2.2) * 1.2;

    trail.rotation.y = t * 0.3;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const nW = container.clientWidth  || 800;
    const nH = container.clientHeight || 500;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
}

/* ================================================================
   SECRET MESSAGE
================================================================ */
(function initSecret() {
  const btn    = document.getElementById("secret-btn");
  const input  = document.getElementById("secret-input");
  const err    = document.getElementById("secret-error");
  const lock   = document.getElementById("lock-screen");
  const reveal = document.getElementById("secret-reveal");
  const photoGrid = document.getElementById("secret-photos");

  btn.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });

  function tryUnlock() {
    if (input.value.trim() === CONFIG.secretAnswer) {
      lock.classList.add("hidden");
      reveal.classList.remove("hidden");
      // Populate secret photos
      CONFIG.secretPhotos.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Secret Memory";
        img.onerror = () => { img.style.background = "#f9a8d4"; img.removeAttribute("src"); };
        photoGrid.appendChild(img);
      });
      launchConfetti(); // mini celebration
    } else {
      err.classList.remove("hidden");
      input.style.borderColor = "#f87171";
      setTimeout(() => { err.classList.add("hidden"); input.style.borderColor = ""; }, 2500);
    }
  }
})();

/* ================================================================
   MINI GAME — Catch My Love
================================================================ */
(function initGame() {
  const canvas  = document.getElementById("game-canvas");
  const ctx     = canvas.getContext("2d");
  const scoreEl = document.getElementById("game-score");
  const livesEl = document.getElementById("game-lives");
  const timerEl = document.getElementById("game-timer");
  const fillEl  = document.getElementById("game-progress-fill");
  const overlay = document.getElementById("game-overlay");
  const winEl   = document.getElementById("game-win");

  document.getElementById("game-start-btn").addEventListener("click", startGame);
  document.getElementById("game-replay-btn").addEventListener("click", startGame);

  let score, lives, timeLeft, hearts, basket, running, spawnInterval, countInterval, animFrame;

  function resetState() {
    score    = 0;
    lives    = 3;
    timeLeft = CONFIG.gameDuration;
    hearts   = [];
    basket   = { x: canvas.width / 2, w: 80, h: 20 };
    running  = false;
    scoreEl.textContent = "0";
    livesEl.textContent = "3";
    timerEl.textContent = CONFIG.gameDuration;
    fillEl.style.width  = "100%";
  }

  function startGame() {
    overlay.style.display = "none";
    winEl.classList.add("hidden");
    setCanvasSize();
    resetState();
    running = true;
    launchHearts();
    countDown();
    loop();
  }

  function setCanvasSize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = 420;
  }

  function launchHearts() {
    spawnInterval = setInterval(() => {
      if (!running) return;
      hearts.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -20,
        speed: 2 + Math.random() * 3,
        char: Math.random() > 0.5 ? "❤️" : "💗",
        size: 22 + Math.random() * 12,
      });
    }, 700);
  }

  function countDown() {
    countInterval = setInterval(() => {
      if (!running) return;
      timeLeft--;
      timerEl.textContent = Math.max(0, timeLeft);
      fillEl.style.width  = (timeLeft / CONFIG.gameDuration * 100) + "%";
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw basket
    const bx = basket.x - basket.w / 2;
    const by = canvas.height - 40;
    ctx.fillStyle = "rgba(181,82,107,0.7)";
    ctx.beginPath();
    ctx.roundRect(bx, by, basket.w, basket.h, 8);
    ctx.fill();
    ctx.font = "18px serif";
    ctx.fillText("🧺", bx + basket.w / 2 - 10, by + 16);

    // Draw + update falling hearts
    hearts = hearts.filter(h => {
      h.y += h.speed;
      ctx.font = `${h.size}px serif`;
      ctx.fillText(h.char, h.x, h.y);

      // Caught?
      if (h.y > by - 5 && h.y < by + basket.h + 10 && Math.abs(h.x - basket.x) < basket.w / 2 + 10) {
        score++;
        scoreEl.textContent = score;
        return false; // remove
      }

      // Missed
      if (h.y > canvas.height + 20) {
        lives = Math.max(0, lives - 1);
        livesEl.textContent = lives;
        if (lives <= 0) { endGame(); return false; }
        return false;
      }

      return true;
    });

    animFrame = requestAnimationFrame(loop);
  }

  // Mouse / touch
  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left;
  });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    basket.x = e.touches[0].clientX - rect.left;
  }, { passive: false });

  function endGame() {
    running = false;
    clearInterval(spawnInterval);
    clearInterval(countInterval);
    cancelAnimationFrame(animFrame);

    if (score >= CONFIG.gameTargetScore) {
      winEl.classList.remove("hidden");
      launchConfetti();
      launchFireworksBurst();
    } else {
      // Show restart via overlay
      overlay.querySelector("h3").textContent = `Game Over! You scored ${score} ❤️`;
      overlay.querySelector("p").textContent   = `Need ${CONFIG.gameTargetScore} to win. Try again?`;
      overlay.querySelector("button").textContent = "Try Again 💪";
      overlay.style.display = "flex";
    }
  }
})();

/* ================================================================
   THREE.JS — FINALE HEART
================================================================ */
function initFinaleThree() {
  const container = document.getElementById("finale-three");
  const W = container.clientWidth  || window.innerWidth;
  const H = container.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset    = "0";
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
  camera.position.set(0, 0, 8);

  scene.add(new THREE.AmbientLight(0xfff0f5, 0.4));
  const dl = new THREE.DirectionalLight(0xffc0cb, 1.5);
  dl.position.set(3, 6, 4);
  scene.add(dl);
  const pL = new THREE.PointLight(0xB5526B, 4, 20);
  pL.position.set(0, 0, 5);
  scene.add(pL);

  const heartShape = makeHeartShape();
  const geo = new THREE.ExtrudeGeometry(heartShape, { depth: 0.6, bevelEnabled: true, bevelSegments: 10, steps: 2, bevelSize: 0.12, bevelThickness: 0.12 });
  geo.center();
  const mat = new THREE.MeshPhongMaterial({ color: 0xB5526B, emissive: 0x5A0F20, emissiveIntensity: 0.6, shininess: 120, specular: 0xffccdd });
  const heart = new THREE.Mesh(geo, mat);
  heart.rotation.x = Math.PI;
  heart.scale.set(1.4, 1.4, 1.4);
  scene.add(heart);

  // Floating star particles
  const starGeo = new THREE.BufferGeometry();
  const sCt = 600;
  const sPos = new Float32Array(sCt * 3);
  for (let i = 0; i < sCt; i++) {
    sPos[i * 3]     = (Math.random() - 0.5) * 30;
    sPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xfde68a, size: 0.06, transparent: true, opacity: 0.7 })));

  const clock = new THREE.Clock();

  // Trigger fireworks + finale when scrolled into view
  ScrollTrigger.create({
    trigger: "#finale",
    start: "top 60%",
    once: true,
    onEnter: () => {
      initFireworks();
      gsap.from("#finale-text > *", { y: 40, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power2.out" });
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    heart.rotation.y = t * 0.5;
    const pulse = 1 + 0.08 * Math.sin(t * 2.2);
    heart.scale.set(1.4 * pulse, 1.4 * pulse, 1.4 * pulse);
    pL.intensity = 3.5 + Math.sin(t * 2.2) * 1.5;
    renderer.render(scene, camera);
  }
  animate();
}

/* ================================================================
   FIREWORKS CANVAS
================================================================ */
function initFireworks() {
  const canvas = document.getElementById("fireworks-canvas");
  if (!canvas || canvas._fwInit) return;
  canvas._fwInit = true;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth  || window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const rockets = [];

  function spawnRocket() {
    rockets.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      tx: Math.random() * canvas.width,
      ty: canvas.height * 0.15 + Math.random() * canvas.height * 0.4,
      particles: null,
    });
  }

  setInterval(spawnRocket, 1200);
  spawnRocket();

  const colors = ["#f9a8d4","#fde68a","#B5526B","#a5b4fc","#6ee7b7","#ffffff","#C9A84C"];

  function explode(x, y) {
    const parts = [];
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 / 80) * i;
      const speed = 2 + Math.random() * 3;
      parts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return parts;
  }

  function drawFrame() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rockets.forEach((r, ri) => {
      if (!r.particles) {
        // Flying up
        const dx = r.tx - r.x, dy = r.ty - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        r.x += dx / dist * 12;
        r.y += dy / dist * 12;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        if (Math.abs(r.x - r.tx) < 14 && Math.abs(r.y - r.ty) < 14) {
          r.particles = explode(r.x, r.y);
        }
      } else {
        // Exploding
        r.particles = r.particles.filter(p => {
          p.x  += p.vx; p.y  += p.vy;
          p.vy += 0.08;
          p.life -= 0.018;
          if (p.life <= 0) return false;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
          return true;
        });
        if (r.particles.length === 0) rockets.splice(ri, 1);
      }
    });
    requestAnimationFrame(drawFrame);
  }
  drawFrame();
}

function launchFireworksBurst() {
  const canvas = document.getElementById("fireworks-canvas");
  // Scroll to finale and trigger fireworks immediately
  gsap.to(window, { scrollTo: "#finale", duration: 1.5, ease: "power2.inOut" });
}

/* ================================================================
   REPLAY BUTTON
================================================================ */
document.getElementById("replay-btn").addEventListener("click", () => {
  window.location.reload();
});

/* ================================================================
   UTILITY — Shared heart shape
================================================================ */
function makeHeartShape() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x + 0.5, y + 0.5);
  shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y,      x, y);
  shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
  shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
  shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
  shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
  shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
  return shape;
}

/* ================================================================
   GSAP — register plugins
================================================================ */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
