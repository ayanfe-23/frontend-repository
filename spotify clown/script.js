// ---- Track data ----
// Add the filename to "src" as you download more tracks from Pixabay.
// Leave src as "" for tracks you haven't found audio for yet.
const tracks = [
  { title: "Sunset Drive",    artist: "Nova Ray",         cover: "images/covers/sunset-drive.jpg",    src: "audio/fassounds-escape-your-love-upbeat-fashion-pop-dance-412230.mp3" },
  { title: "Glass Horizon",   artist: "The Quiet Static",  cover: "images/covers/glass-horizon.jpg",   src: "audio/easy_eva-house-july-605765.mp3" },
  { title: "Midnight Arcade", artist: "Pixel Coast",       cover: "images/covers/midnight-arcade.jpg", src: "audio/viio_c-velvet-relaxing-beat-free-for-use-455043.mp3" },
  { title: "Paper Planes",    artist: "Lena Cho",          cover: "images/covers/paper-planes.jpg",    src: "audio/easy_eva-happiness-let-it-go-606741.mp3" },
  { title: "Slow Bloom",      artist: "Marigold",          cover: "images/covers/slow-bloom.jpg",      src: "audio/zephiramusic-blues-lofi-602637.mp3" },
  { title: "City Lights",     artist: "Nova Ray",          cover: "images/covers/city-lights.jpg",     src: "audio/easy_eva-uplifting-friend-605770.mp3" },
  { title: "Static Bloom",    artist: "The Quiet Static",  cover: "images/covers/static-bloom.jpg",    src: "audio/jonasblakewood-punk-rock-593986.mp3" },
  { title: "Coin Return",     artist: "Pixel Coast",       cover: "images/covers/coin-return.jpg",     src: "audio/soulprodmusic-sad-moment-sad-and-melancholy-piano-background-music-124488.mp3" },
  { title: "Folded Note",     artist: "Lena Cho",          cover: "images/covers/folded-note.jpg",     src: "audio/alex-morgan-chillstep-601097.mp3" },
];

// ---- Elements ----
const audio       = document.getElementById("audio-player");
const playBtn     = document.getElementById("play-btn");
const prevBtn     = document.getElementById("prev-btn");
const nextBtn     = document.getElementById("next-btn");
const shuffleBtn  = document.getElementById("shuffle-btn");
const repeatBtn   = document.getElementById("repeat-btn");
const muteBtn     = document.getElementById("mute-btn");

const npArt    = document.getElementById("np-art");
const npTitle  = document.getElementById("np-title");
const npArtist = document.getElementById("np-artist");

const seekBar  = document.getElementById("seek-bar");
const seekFill = document.getElementById("seek-fill");
const timeCur  = document.getElementById("time-current");
const timeTot  = document.getElementById("time-total");

const volumeBar  = document.getElementById("volume-bar");
const volumeFill = document.getElementById("volume-fill");

let currentIndex = null;
let isShuffle = false;
let isRepeat = false;

// ---- Helpers ----
function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function loadTrack(index) {
  const track = tracks[index];
  if (!track) return;

  currentIndex = index;
  npTitle.textContent = track.title;
  npArtist.textContent = track.artist;
  npArt.style.backgroundImage = `url('${track.cover}')`;

  if (!track.src) {
    // No audio file yet for this track
    audio.removeAttribute("src");
    playBtn.textContent = "▶";
    seekFill.style.width = "0%";
    timeCur.textContent = "0:00";
    timeTot.textContent = "0:00";
    return;
  }

  audio.src = track.src;
  audio.play().catch(() => {
    // Autoplay might be blocked until the user interacts; that's fine.
  });
}

function togglePlay() {
  if (currentIndex === null) {
    loadTrack(0);
    return;
  }
  if (!tracks[currentIndex].src) return; // nothing to play yet

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function playNext() {
  if (currentIndex === null) return;
  let next;
  if (isShuffle) {
    next = Math.floor(Math.random() * tracks.length);
  } else {
    next = (currentIndex + 1) % tracks.length;
  }
  loadTrack(next);
}

function playPrev() {
  if (currentIndex === null) return;
  const prev = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prev);
}

// ---- Audio events ----
audio.addEventListener("play", () => {
  playBtn.textContent = "⏸";
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    seekFill.style.width = `${pct}%`;
    timeCur.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  timeTot.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    playNext();
  }
});

// ---- Control buttons ----
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";
});

// ---- Seek bar ----
seekBar.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = seekBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// ---- Volume bar ----
audio.volume = 1;
volumeFill.style.width = "100%";

volumeBar.addEventListener("click", (e) => {
  const rect = volumeBar.getBoundingClientRect();
  const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  audio.volume = pct;
  volumeFill.style.width = `${pct * 100}%`;
});

// ---- Track cards (Made for you / Recently played) ----
document.querySelectorAll(".album-card").forEach((card) => {
  card.addEventListener("click", () => {
    const index = parseInt(card.dataset.track, 10);
    loadTrack(index);
  });
});

// ================= Sidebar navigation =================
const navHome    = document.getElementById("nav-home");
const navSearch  = document.getElementById("nav-search");
const navLibrary = document.getElementById("nav-library");
const navLiked   = document.getElementById("nav-liked");

const homeView    = document.getElementById("home-view");
const searchView  = document.getElementById("search-view");
const likedView   = document.getElementById("liked-view");
const libraryView = document.getElementById("library-view");

const allViews = [homeView, searchView, likedView, libraryView];
const allNavLinks = [navHome, navSearch, navLibrary, navLiked];

// ---- Back / forward history ----
const backBtn = document.getElementById("back-btn");
const forwardBtn = document.getElementById("forward-btn");

let viewHistory = [{ view: homeView, link: navHome }];
let historyIndex = 0;

function updateNavButtons() {
  backBtn.disabled = historyIndex === 0;
  forwardBtn.disabled = historyIndex === viewHistory.length - 1;
}

function renderView(entry) {
  allViews.forEach((v) => (v.style.display = "none"));
  entry.view.style.display = "block";
  allNavLinks.forEach((link) => link.classList.remove("active"));
  if (entry.link) entry.link.classList.add("active");

  if (entry.onShow) entry.onShow();
}

function showView(view, activeLink, onShow) {
  // Drop any "forward" history when navigating somewhere new
  viewHistory = viewHistory.slice(0, historyIndex + 1);
  viewHistory.push({ view, link: activeLink, onShow });
  historyIndex = viewHistory.length - 1;

  renderView(viewHistory[historyIndex]);
  updateNavButtons();
}

backBtn.addEventListener("click", () => {
  if (historyIndex === 0) return;
  historyIndex--;
  renderView(viewHistory[historyIndex]);
  updateNavButtons();
});

forwardBtn.addEventListener("click", () => {
  if (historyIndex === viewHistory.length - 1) return;
  historyIndex++;
  renderView(viewHistory[historyIndex]);
  updateNavButtons();
});

updateNavButtons();

navHome.addEventListener("click", (e) => {
  e.preventDefault();
  showView(homeView, navHome);
});

navSearch.addEventListener("click", (e) => {
  e.preventDefault();
  showView(searchView, navSearch, () => document.getElementById("search-input").focus());
});

navLibrary.addEventListener("click", (e) => {
  e.preventDefault();
  showView(libraryView, navLibrary, () => {
    libraryHeading.textContent = "Your Library";
    renderLibrary();
  });
});

navLiked.addEventListener("click", (e) => {
  e.preventDefault();
  showView(likedView, navLiked, renderLikedList);
});

// Clicking a playlist filters Your Library down to that playlist's tracks
const playlists = {
  "Chill Vibes":      [2, 4, 8],   // Midnight Arcade, Slow Bloom, Folded Note
  "Late Night Drive": [0, 1],      // Sunset Drive, Glass Horizon
  "Focus Flow":       [3, 8],      // Paper Planes, Folded Note
  "90s Throwback":    [0, 6],      // Sunset Drive, Static Bloom
  "Workout Mix":      [5, 6],      // City Lights, Static Bloom
  "Rainy Day":        [4, 7],      // Slow Bloom, Coin Return
};

const libraryHeading = libraryView.querySelector(".greeting");

function openPlaylist(name) {
  const indices = playlists[name];
  showView(libraryView, navLibrary, () => {
    libraryHeading.textContent = name || "Your Library";
    renderLibrary(indices);
  });
}

document.querySelectorAll("#playlist-list li").forEach((li) => {
  li.addEventListener("click", () => {
    openPlaylist(li.dataset.playlist);
  });
});

// ================= Reusable card builder =================
function buildAlbumCard(track, index) {
  const card = document.createElement("div");
  card.className = "album-card";
  card.dataset.track = index;
  card.innerHTML = `
    <div class="album-art" style="background-image: url('${track.cover}');"></div>
    <div class="album-name">${track.title}</div>
    <div class="album-desc">${track.artist}</div>
  `;
  card.addEventListener("click", () => loadTrack(index));
  attachCardLikeButton(card, index);
  return card;
}

// ================= Search =================
const searchInput  = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchEmpty  = document.getElementById("search-empty");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  if (!query) {
    searchEmpty.style.display = "none";
    return;
  }

  const matches = tracks
    .map((track, index) => ({ track, index }))
    .filter(({ track }) =>
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query)
    );

  if (matches.length === 0) {
    searchEmpty.style.display = "block";
    return;
  }

  searchEmpty.style.display = "none";
  matches.forEach(({ track, index }) => {
    searchResults.appendChild(buildAlbumCard(track, index));
  });
});

// ================= Your Library =================
const libraryGrid = document.getElementById("library-grid");

function renderLibrary(indices) {
  libraryGrid.innerHTML = "";
  const list = indices ? indices.map((i) => ({ track: tracks[i], index: i })) : tracks.map((track, index) => ({ track, index }));
  list.forEach(({ track, index }) => {
    libraryGrid.appendChild(buildAlbumCard(track, index));
  });
}

// ================= Liked Songs =================
let likedTracks = new Set();
const likedListEl = document.getElementById("liked-list");
const likeBtn = document.getElementById("like-btn");

function isLiked(index) {
  return likedTracks.has(index);
}

function toggleLike(index) {
  if (likedTracks.has(index)) {
    likedTracks.delete(index);
  } else {
    likedTracks.add(index);
  }
  updateAllLikeUI();
}

function updateAllLikeUI() {
  // Now-playing heart
  likeBtn.textContent = currentIndex !== null && isLiked(currentIndex) ? "❤️" : "♡";

  // Every card's heart, wherever it currently exists in the DOM
  document.querySelectorAll(".album-card").forEach((card) => {
    const btn = card.querySelector(".card-like-btn");
    if (!btn) return;
    const index = parseInt(card.dataset.track, 10);
    const liked = isLiked(index);
    btn.textContent = liked ? "❤️" : "♡";
    btn.classList.toggle("liked", liked);
  });

  // Refresh the Liked Songs list if it's currently visible
  if (likedView.style.display !== "none") {
    renderLikedList();
  }
}

function attachCardLikeButton(card, index) {
  const btn = document.createElement("button");
  btn.className = "card-like-btn";
  btn.textContent = isLiked(index) ? "❤️" : "♡";
  if (isLiked(index)) btn.classList.add("liked");
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // don't trigger the card's play click
    toggleLike(index);
  });
  card.appendChild(btn);
}

likeBtn.addEventListener("click", () => {
  if (currentIndex === null) return;
  toggleLike(currentIndex);
});

function renderLikedList() {
  likedListEl.innerHTML = "";

  if (likedTracks.size === 0) {
    const empty = document.createElement("p");
    empty.className = "liked-empty";
    empty.textContent = "Songs you like will appear here. Click the heart on any track.";
    likedListEl.appendChild(empty);
    return;
  }

  [...likedTracks].forEach((index) => {
    const track = tracks[index];
    const li = document.createElement("li");
    li.className = "liked-row";
    li.innerHTML = `
      <div class="liked-art" style="background-image: url('${track.cover}');"></div>
      <div class="liked-info">
        <div class="liked-title">${track.title}</div>
        <div class="liked-artist">${track.artist}</div>
      </div>
      <button class="liked-remove">✕</button>
    `;
    li.querySelector(".liked-art").addEventListener("click", () => loadTrack(index));
    li.querySelector(".liked-remove").addEventListener("click", () => {
      likedTracks.delete(index);
      updateAllLikeUI();
    });
    likedListEl.appendChild(li);
  });
}

// Attach heart buttons to the cards already in the HTML (Made for you / Recently played)
document.querySelectorAll(".album-card").forEach((card) => {
  const index = parseInt(card.dataset.track, 10);
  attachCardLikeButton(card, index);
});

// ================= Create Playlist =================
const createPlaylistBtn = document.getElementById("create-playlist-btn");
const playlistList = document.getElementById("playlist-list");

createPlaylistBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = prompt("Name your new playlist:");
  if (!name || !name.trim()) return;
  const trimmed = name.trim();

  playlists[trimmed] = []; // empty for now — add track indices here as you like

  const li = document.createElement("li");
  li.dataset.playlist = trimmed;
  li.textContent = trimmed;
  li.addEventListener("click", () => openPlaylist(trimmed));
  playlistList.appendChild(li);
});

// Refresh every heart icon whenever the track changes
const originalLoadTrack = loadTrack;
loadTrack = function (index) {
  originalLoadTrack(index);
  updateAllLikeUI();
};