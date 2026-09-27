// ---- decorative stars ----
const starsWrap = document.getElementById('stars');
for(let i=0;i<40;i++){
  const s = document.createElement('span');
  s.style.left = Math.random()*100+'%';
  s.style.top = Math.random()*100+'%';
  s.style.animationDelay = (Math.random()*6)+'s';
  s.style.animationDuration = (4+Math.random()*4)+'s';
  starsWrap.appendChild(s);
}
// floating petals/hearts
const petalChars = ['❤','✦','❥'];
for(let i=0;i<14;i++){
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = petalChars[Math.floor(Math.random()*petalChars.length)];
  p.style.left = Math.random()*100+'%';
  p.style.animationDuration = (10+Math.random()*10)+'s';
  p.style.animationDelay = (Math.random()*10)+'s';
  p.style.fontSize = (0.8+Math.random()*1.2)+'rem';
  starsWrap.appendChild(p);
}

// ---- letter text (edit here) ----
const letterText = `Happy Birthday my princess ❤️, I wish you long life, prosperity, good health, success, happiness and strength that'll enable you to achieve your goals and dreams. I pray you make it in life and may God all be with you and protect you from every evil, you'll not lack good things and the enemy shall not rejoice over you in Jesus name.
I love you so much oluwaferanmi ❤️, my twin🥹, my sister from another mother 🫶, you're literally one of the best gifts that school gave me and I never want to lose you (forever is the deal 😂❤️). You're a really good person, you're nice, kind, caring, annoying and I love the way you always help people. I know I always offend you 😂 and you think I'm annoying (lol I'll never stop annoying you), but it's all because I love you and yes I admit that I love copying your style because you're so cool and pretty, you're beautiful both in and out 🥹❤️, you make me laugh, you've helped me improve in so many, you always encourage me and you always remind me that I'm not alone and you'll always stand by me no matter what and I really appreciate that❤️.
Sometimes we argue over stupid and trivial matters but I'm glad those little arguments didn't end our friendship🫂❤️. I appreciate the time we've spent together and the memories we've made❤️. Once again happy birthday oldie😂, I love love you ❤️ and I pray this friendship last forever (AMEN), have a great and amazing day ❤️.`;

const letterBody = document.getElementById('letterBody');
letterText.split('\n').filter(Boolean).forEach(para=>{
  const p = document.createElement('p');
  p.textContent = para.trim();
  letterBody.appendChild(p);
});

// ---- scene transition ----
const landing = document.getElementById('landing');
const letterScene = document.getElementById('letterScene');
const openBtn = document.getElementById('openBtn');
const countdownScene = document.getElementById('countdownScene');
const countdownText = document.getElementById('countdownText');

openBtn.addEventListener('click', ()=>{
  landing.classList.add('leaving');
  setTimeout(()=>{
    landing.classList.remove('active','leaving');
    countdownScene.classList.add('active');
    runCountdown();
  }, 900);
});

function runCountdown(){
  const sequence = [
    { text:'3', hold:650, number:true },
    { text:'2', hold:650, number:true },
    { text:'1', hold:650, number:true },
    { text:'HAPPY', hold:900 },
    { text:'BIRTHDAY', hold:900 },
    { text:'MARYY!!', hold:1800, big:true }
  ];
  let idx = 0;

  function step(){
    if(idx >= sequence.length){
      countdownScene.classList.add('leaving');
      setTimeout(()=>{
        countdownScene.classList.remove('active','leaving');
        letterScene.classList.add('active');
      }, 900);
      return;
    }
    const item = sequence[idx];
    countdownText.textContent = item.text;
    countdownText.className = 'countdown-text show' + (item.big ? ' big' : '') + (item.number ? ' number' : '');
    setTimeout(()=>{
      countdownText.classList.remove('show');
      setTimeout(()=>{
        idx += 1;
        step();
      }, 400);
    }, item.hold);
  }
  step();
}

// ---- envelope open interaction ----
const envelope = document.getElementById('envelope');
const envFlap = document.getElementById('envFlap');
const seal = document.getElementById('seal');
const envelopeWrap = document.getElementById('envelopeWrap');
const letterPaper = document.getElementById('letterPaper');
let opened = false;

function openLetter(){
  if(opened) return;
  opened = true;
  seal.classList.add('break');
  setTimeout(()=>{ envFlap.classList.add('open'); }, 250);
  setTimeout(()=>{ envelopeWrap.classList.add('hide'); }, 900);
  setTimeout(()=>{
    letterPaper.classList.add('reveal');
    document.body.classList.add('unlocked');
    letterPaper.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(startAutoScroll, 1800);
    setTimeout(()=>{ document.getElementById('continueBtn').classList.add('show'); }, 26000); // safety net
  }, 1200);
}

envelope.addEventListener('click', openLetter);
envelope.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') openLetter(); });

// ---- letter auto-scrolls itself, like reading it slowly ----
let autoScrollId = null;
let paused = false;
let resumeTimer = null;

function startAutoScroll(){
  const maxScroll = letterPaper.scrollHeight - letterPaper.clientHeight;
  const targetDurationSeconds = 22; // aim to finish reading in ~22s regardless of letter length
  const speed = maxScroll > 0 ? Math.max(maxScroll / (targetDurationSeconds * 60), 0.6) : 0;

  if(maxScroll <= 0){
    continueBtn.classList.add('show');
    return;
  }

  function step(){
    if(!paused){
      const currentMax = letterPaper.scrollHeight - letterPaper.clientHeight;
      if(letterPaper.scrollTop < currentMax){
        letterPaper.scrollTop += speed;
      } else {
        continueBtn.classList.add('show');
      }
    }
    autoScrollId = requestAnimationFrame(step);
  }
  autoScrollId = requestAnimationFrame(step);
}

// pause the auto-scroll briefly if she wants to linger on a line herself
function pauseThenResume(){
  paused = true;
  clearTimeout(resumeTimer);
  resumeTimer = setTimeout(()=>{ paused = false; }, 2500);
}
letterPaper.addEventListener('wheel', pauseThenResume, {passive:true});
letterPaper.addEventListener('touchstart', pauseThenResume, {passive:true});

// ---- letter -> memories book transition ----
const continueBtn = document.getElementById('continueBtn');
const bookScene = document.getElementById('bookScene');

continueBtn.addEventListener('click', ()=>{
  letterScene.classList.add('leaving');
  setTimeout(()=>{
    letterScene.classList.remove('active','leaving');
    bookScene.classList.add('active');
  }, 900);
});

// ============ MEMORIES BOOK ============
// TODO: paste your Cloudinary video/photo links in here, one entry per page.
// type: 'video' (plays, then shows Replay/Next) or 'image' (shows Next right away).
// Add or remove entries freely - the book adjusts automatically.
const videoData = [
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229021/IMG_2417_hyqluc.mp4', caption: 'Memory 1' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229118/IMG_2418_mvr7fi.mp4', caption: 'Memory 2' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229159/IMG_2419_g62rf1.mp4', caption: 'Memory 3' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229197/IMG_2420_yciye0.mp4', caption: 'Memory 4' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229249/IMG_2421_borely.mp4', caption: 'Memory 5' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229303/IMG_2423_xzlpii.mp4', caption: 'Memory 6' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229337/IMG_2424_iqrtdw.mp4', caption: 'Memory 7' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229372/IMG_2416_sllzr8.mp4', caption: 'Memory 8' },
  { type: 'video', src: 'https://res.cloudinary.com/dwoz7t6li/video/upload/v1789229404/IMG_2415_jw7oit.mp4', caption: 'Memory 9' },
  { type: 'image', src: 'https://res.cloudinary.com/dwoz7t6li/image/upload/v1789229448/photo_2026-09-12_17-01-40_ddgkot.jpg', caption: 'Memory 10' },
  { type: 'image', src: 'https://res.cloudinary.com/dwoz7t6li/image/upload/v1789229469/photo_2026-09-12_17-01-35_ijtdxn.jpg', caption: 'Memory 11' }
];

let currentIndex = 0;

const memoryVideo = document.getElementById('memoryVideo');
const memoryImage = document.getElementById('memoryImage');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const replayBtn = document.getElementById('replayBtn');
const skipBtn = document.getElementById('skipBtn');
const videoFrame = document.querySelector('.video-frame');
const pageCounter = document.getElementById('pageCounter');
const bookCover = document.getElementById('bookCover');

// Cloudinary auto format + auto quality = much smaller, much faster loads.
// Only touches real cloudinary.com URLs; leaves anything else untouched.
function optimizeCloudinaryUrl(url){
  if(!url || !url.includes('res.cloudinary.com')) return url;
  if(url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

function loadVideo(index){
  const data = videoData[index];
  pageCounter.textContent = (index+1) + ' / ' + videoData.length;

  // reset both media elements first
  memoryVideo.pause();
  memoryVideo.removeAttribute('src');
  memoryVideo.classList.remove('has-src');
  memoryImage.removeAttribute('src');
  memoryImage.classList.remove('has-src');
  videoPlaceholder.style.display = 'none';

  skipBtn.classList.toggle('hidden', !data.src);

  if(!data.src){
    videoPlaceholder.style.display = 'block';
    replayBtn.classList.add('hidden');
    return;
  }

  const src = optimizeCloudinaryUrl(data.src);

  if(data.type === 'image'){
    memoryImage.src = src;
    memoryImage.classList.add('has-src');
    replayBtn.classList.add('hidden');
  } else {
    memoryVideo.src = src;
    memoryVideo.classList.add('has-src');
    replayBtn.classList.remove('hidden');
    memoryVideo.currentTime = 0;
    memoryVideo.play().catch(()=>{ /* autoplay may be blocked until she taps */ });
  }

  preloadNext(index);
}

// quietly warm the browser cache for the next page while this one plays
function preloadNext(index){
  const next = videoData[index + 1];
  if(!next || !next.src) return;
  const src = optimizeCloudinaryUrl(next.src);
  if(next.type === 'image'){
    const img = new Image();
    img.src = src;
  } else {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    document.head.appendChild(link);
  }
}

// tap the closed red cover to open the book
let bookOpened = false;
function openBook(){
  if(bookOpened) return;
  bookOpened = true;
  bookCover.classList.add('opened');
  setTimeout(()=>{ loadVideo(currentIndex); }, 1300);
}
bookCover.addEventListener('click', openBook);
bookCover.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') openBook(); });

replayBtn.addEventListener('click', ()=>{
  memoryVideo.currentTime = 0;
  memoryVideo.play();
});

function advanceToNext(){
  const isLast = currentIndex === videoData.length - 1;
  if(isLast){
    goToFinale();
    return;
  }

  videoFrame.classList.add('flipping');
  setTimeout(()=>{
    currentIndex += 1;
    loadVideo(currentIndex);
    videoFrame.classList.remove('flipping');
  }, 700);
}

skipBtn.addEventListener('click', advanceToNext);

// ============ FINALE: FLOWERS FORMING A HEART + MESSAGE ============
const finaleScene = document.getElementById('finaleScene');
const flowerHeart = document.getElementById('flowerHeart');
const finaleMessage = document.getElementById('finaleMessage');

function goToFinale(){
  bookScene.classList.add('leaving');
  setTimeout(()=>{
    bookScene.classList.remove('active','leaving');
    finaleScene.classList.add('active');
    playFlowerHeart();
  }, 900);
}

// heart parametric curve: t in [0, 2π)
function heartPoint(t){
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
  return { x, y: -y }; // flip so the heart points down correctly on screen
}

const flowerChars = ['🌸','🌷','🌹','💮','🌺'];

function playFlowerHeart(){
  flowerHeart.innerHTML = '';
  const count = 26;
  for(let i = 0; i < count; i++){
    const t = (i / count) * Math.PI * 2;
    const pt = heartPoint(t);
    // heart formula roughly spans x:[-16,16], y:[-17,13] -> normalize to 0-100%
    const leftPct = 50 + (pt.x / 18) * 42;
    const topPct = 50 + (pt.y / 18) * 42;

    const el = document.createElement('span');
    el.className = 'flower';
    el.textContent = flowerChars[i % flowerChars.length];
    el.style.setProperty('--rot', (Math.random()*40 - 20) + 'deg');
    flowerHeart.appendChild(el);

    setTimeout(()=>{
      el.style.left = leftPct + '%';
      el.style.top = topPct + '%';
      el.classList.add('placed');
    }, 150 + i * 60);
  }

  const totalFlowerTime = 150 + count * 60 + 1800;
  setTimeout(revealFinaleMessage, totalFlowerTime);
}

// TODO: paste the closing message here - one entry per line.
// Lines stack up and stay on screen (they don't fade away like the countdown).
const finaleLines = [
  'Always remember you\'re beautiful, pretty and smart.',
  'Don\'t let anybody make you look down on yourself.',
  'Once again Happy Birthday Mary ❤️.',
  'I love youuu 🫶❤️'
];

function revealFinaleMessage(){
  finaleMessage.innerHTML = '';
  const container = document.createElement('p');
  container.className = 'finale-line';
  finaleMessage.appendChild(container);

  let delay = 0;
  finaleLines.forEach((line, lineIndex)=>{
    const words = line.split(' ');
    words.forEach((word, wordIndex)=>{
      const span = document.createElement('span');
      span.className = 'finale-word';
      span.textContent = word + (wordIndex < words.length - 1 ? '\u00A0' : '');
      container.appendChild(span);
      setTimeout(()=>{ span.classList.add('show'); }, delay);
      delay += 380;
    });
    if(lineIndex < finaleLines.length - 1){
      container.appendChild(document.createElement('br'));
    }
  });
}