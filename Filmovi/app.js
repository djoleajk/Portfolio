// ========================================
// Sample Movies Data
// ========================================
const moviesData = [
    {
        id: 1,
        title: "Veliki Gatsby",
        year: 2013,
        duration: "143 min",
        genre: "Drama",
        description: "Adaptacija klasičnog romana F. Scott Fitzgeralda o misterioznom milioneru Jay Gatsbyu i njegovoj opsesivnoj ljubavi prema lepoj Daisy Buchanan.",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        sources: [
            {
                name: "Izvor A (MP4)",
                type: "mp4",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            },
            {
                name: "Izvor B (YouTube)",
                type: "iframe",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            }
        ]
    },
    {
        id: 2,
        title: "Interstellar",
        year: 2014,
        duration: "169 min",
        genre: "Naučna fantastika",
        description: "Tim astronauta putuje kroz crvotočinu u potrazi za novim domom za čovečanstvo dok Zemlja umire.",
        poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
        sources: [
            {
                name: "Izvor A (MP4)",
                type: "mp4",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            },
            {
                name: "Izvor B (HLS Stream)",
                type: "hls",
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
            }
        ]
    },
    {
        id: 3,
        title: "Početak",
        year: 2010,
        duration: "148 min",
        genre: "Akcija",
        description: "Dom Cobb je veštim lopov, najbolji u opasnoj umetnosti ekstrakcije: krađi vrednih tajni iz podsvesti tokom stanja sna.",
        poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
        sources: [
            {
                name: "Izvor A (MP4)",
                type: "mp4",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            },
            {
                name: "Izvor B (YouTube)",
                type: "iframe",
                url: "https://www.youtube.com/embed/YQHsXMglC9A"
            }
        ]
    },
    {
        id: 4,
        title: "Matrix",
        year: 1999,
        duration: "136 min",
        genre: "Naučna fantastika",
        description: "Kompjuterski haker Neo otkriva da je stvarnost simulacija koju kontrolišu inteligentne mašine, i pridružuje se pobunjenicima u borbi protiv njih.",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
        sources: [
            {
                name: "Izvor A (HLS Stream)",
                type: "hls",
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
            },
            {
                name: "Izvor B (MP4)",
                type: "mp4",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            }
        ]
    },
    {
        id: 5,
        title: "Krstni otac",
        year: 1972,
        duration: "175 min",
        genre: "Krimi",
        description: "Starenje patrijarha organizovanog kriminalnog dinastije prenosi kontrolu svog tajnog imperija na svog nevoljnog sina.",
        poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
        sources: [
            {
                name: "Izvor A (MP4)",
                type: "mp4",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
            },
            {
                name: "Izvor B (YouTube)",
                type: "iframe",
                url: "https://www.youtube.com/embed/sGbxmsDFVnE"
            }
        ]
    },
    {
        id: 6,
        title: "Tamni vitez",
        year: 2008,
        duration: "152 min",
        genre: "Akcija",
        description: "Batman podiže ulog u borbi protiv zločina. Uz pomoć poručnika Gordona i tužioca Harveya Denta, Batman kreće da razmontira preostale kriminalne organizacije.",
        poster: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=600&fit=crop",
        sources: [
            {
                name: "Izvor A (MP4)",
                type: "mp4",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
            },
            {
                name: "Izvor B (HLS Stream)",
                type: "hls",
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
            },
            {
                name: "Izvor C (YouTube)",
                type: "iframe",
                url: "https://www.youtube.com/embed/EXeTwQWrcwY"
            }
        ]
    }
];

// ========================================
// Application State
// ========================================
let allMovies = [];
let currentMovie = null;
let currentSourceIndex = 0;
let hlsInstance = null;
let filteredMovies = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let editingMovieId = null;
let sourceCounter = 0;

// ========================================
// DOM Elements
// ========================================
const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const resetFiltersBtn = document.getElementById('resetFilters');
const noResults = document.getElementById('noResults');
const showFavoritesBtn = document.getElementById('showFavoritesBtn');
const favoritesCount = document.getElementById('favoritesCount');

// Modal elements
const movieModal = document.getElementById('movieModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalPoster = document.getElementById('modalPoster');
const modalYear = document.getElementById('modalYear');
const modalDuration = document.getElementById('modalDuration');
const modalGenre = document.getElementById('modalGenre');
const modalDescription = document.getElementById('modalDescription');
const toggleFavorite = document.getElementById('toggleFavorite');
const favoriteIcon = document.getElementById('favoriteIcon');
const favoriteText = document.getElementById('favoriteText');

// Player elements
const sourceSelect = document.getElementById('sourceSelect');
const playerContainer = document.getElementById('playerContainer');
const videoPlayer = document.getElementById('videoPlayer');
const iframePlayer = document.getElementById('iframePlayer');
const playerError = document.getElementById('playerError');
const tryAnotherSource = document.getElementById('tryAnotherSource');

// Video controls
const videoControls = document.getElementById('videoControls');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const speedControl = document.getElementById('speedControl');
const pipBtn = document.getElementById('pipBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Admin elements
const showAdminBtn = document.getElementById('showAdminBtn');
const adminModal = document.getElementById('adminModal');
const adminModalOverlay = document.getElementById('adminModalOverlay');
const adminModalClose = document.getElementById('adminModalClose');
const tabBtns = document.querySelectorAll('.tab-btn');
const addMovieTab = document.getElementById('addMovieTab');
const manageMoviesTab = document.getElementById('manageMoviesTab');
const movieForm = document.getElementById('movieForm');
const addSourceBtn = document.getElementById('addSourceBtn');
const sourcesContainer = document.getElementById('sourcesContainer');
const posterPreview = document.getElementById('posterPreview');
const posterPreviewImg = document.getElementById('posterPreviewImg');
const moviePosterInput = document.getElementById('moviePoster');
const saveMovieBtnText = document.getElementById('saveMovieBtnText');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const manageMoviesList = document.getElementById('manageMoviesList');
const manageSearchInput = document.getElementById('manageSearchInput');

// ========================================
// Initialization
// ========================================
function init() {
    loadMoviesFromStorage();
    populateFilters();
    renderMovies(allMovies);
    updateFavoritesCount();
    attachEventListeners();
}

// ========================================
// LocalStorage Management
// ========================================
function loadMoviesFromStorage() {
    const customMovies = JSON.parse(localStorage.getItem('customMovies')) || [];
    
    // Merge default movies with custom movies
    allMovies = [...moviesData, ...customMovies];
    filteredMovies = [...allMovies];
}

function saveMoviesToStorage(customMovies) {
    localStorage.setItem('customMovies', JSON.stringify(customMovies));
}

function getCustomMovies() {
    return JSON.parse(localStorage.getItem('customMovies')) || [];
}

function getNextMovieId() {
    const maxId = Math.max(...allMovies.map(m => m.id), 0);
    return maxId + 1;
}

// ========================================
// Populate Filters
// ========================================
function populateFilters() {
    // Clear existing options
    genreFilter.innerHTML = '<option value="">Svi žanrovi</option>';
    yearFilter.innerHTML = '<option value="">Sve godine</option>';
    
    // Extract unique genres
    const genres = [...new Set(allMovies.map(m => m.genre))].sort();
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    // Extract unique years
    const years = [...new Set(allMovies.map(m => m.year))].sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// ========================================
// Render Movies
// ========================================
function renderMovies(movies) {
    moviesGrid.innerHTML = '';
    
    if (movies.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    movies.forEach(movie => {
        const isFavorite = favorites.includes(movie.id);
        
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.setAttribute('role', 'listitem');
        movieCard.setAttribute('tabindex', '0');
        movieCard.setAttribute('aria-label', `${movie.title} - Kliknite za više detalja`);
        
        movieCard.innerHTML = `
            ${isFavorite ? '<div class="favorite-badge">⭐</div>' : ''}
            <img src="${movie.poster}" alt="${movie.title} poster" class="movie-poster">
            <div class="movie-card-content">
                <h3 class="movie-card-title">${movie.title}</h3>
                <p class="movie-card-description">${movie.description}</p>
            </div>
        `;
        
        movieCard.addEventListener('click', () => openMovieModal(movie));
        movieCard.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') openMovieModal(movie);
        });
        
        moviesGrid.appendChild(movieCard);
    });
}

// ========================================
// Search and Filter
// ========================================
function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    const selectedYear = yearFilter.value;
    
    filteredMovies = allMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm) ||
                            movie.description.toLowerCase().includes(searchTerm);
        const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
        const matchesYear = !selectedYear || movie.year == selectedYear;
        
        return matchesSearch && matchesGenre && matchesYear;
    });
    
    renderMovies(filteredMovies);
}

function resetFilters() {
    searchInput.value = '';
    genreFilter.value = '';
    yearFilter.value = '';
    filterMovies();
}

// ========================================
// Favorites
// ========================================
function toggleMovieFavorite(movieId) {
    const index = favorites.indexOf(movieId);
    
    if (index === -1) {
        favorites.push(movieId);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    updateFavoriteButton(movieId);
    renderMovies(filteredMovies);
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
}

function updateFavoriteButton(movieId) {
    const isFavorite = favorites.includes(movieId);
    
    if (isFavorite) {
        toggleFavorite.classList.add('active');
        favoriteIcon.textContent = '⭐';
        favoriteText.textContent = 'Ukloni iz omiljenih';
    } else {
        toggleFavorite.classList.remove('active');
        favoriteIcon.textContent = '☆';
        favoriteText.textContent = 'Dodaj u omiljene';
    }
}

function showFavorites() {
    if (favorites.length === 0) {
        alert('Nemate omiljenih filmova.');
        return;
    }
    
    const favoriteMovies = allMovies.filter(m => favorites.includes(m.id));
    renderMovies(favoriteMovies);
    searchInput.value = '';
    genreFilter.value = '';
    yearFilter.value = '';
}

// ========================================
// Modal
// ========================================
function openMovieModal(movie) {
    currentMovie = movie;
    currentSourceIndex = 0;
    
    // Populate movie details
    modalTitle.textContent = movie.title;
    modalTitle.id = 'modalTitle';
    modalPoster.src = movie.poster;
    modalPoster.alt = `${movie.title} poster`;
    modalYear.textContent = `📅 ${movie.year}`;
    modalDuration.textContent = `⏱️ ${movie.duration}`;
    modalGenre.textContent = `🎭 ${movie.genre}`;
    modalDescription.textContent = movie.description;
    
    // Populate sources
    sourceSelect.innerHTML = '';
    movie.sources.forEach((source, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = source.name;
        sourceSelect.appendChild(option);
    });
    
    // Update favorite button
    updateFavoriteButton(movie.id);
    
    // Load first source
    loadSource(0);
    
    // Show modal
    movieModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on modal
    modalClose.focus();
}

function closeMovieModal() {
    movieModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Stop video playback
    if (videoPlayer.style.display !== 'none') {
        videoPlayer.pause();
    }
    
    // Destroy HLS instance
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
    
    currentMovie = null;
}

// ========================================
// Video Player
// ========================================
function loadSource(sourceIndex) {
    if (!currentMovie) return;
    
    currentSourceIndex = sourceIndex;
    const source = currentMovie.sources[sourceIndex];
    
    // Hide error
    playerError.style.display = 'none';
    
    // Reset players
    videoPlayer.style.display = 'none';
    iframePlayer.style.display = 'none';
    videoControls.style.display = 'none';
    
    // Destroy previous HLS instance
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
    
    if (source.type === 'iframe') {
        loadIframeSource(source.url);
    } else if (source.type === 'hls') {
        loadHLSSource(source.url);
    } else if (source.type === 'mp4') {
        loadMP4Source(source.url);
    }
}

function loadMP4Source(url) {
    videoPlayer.src = url;
    videoPlayer.style.display = 'block';
    videoControls.style.display = 'block';
    videoPlayer.load();
    
    videoPlayer.addEventListener('error', handleVideoError);
}

function loadHLSSource(url) {
    videoPlayer.style.display = 'block';
    videoControls.style.display = 'block';
    
    if (Hls.isSupported()) {
        hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });
        
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(videoPlayer);
        
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded');
        });
        
        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                handleVideoError();
            }
        });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoPlayer.src = url;
        videoPlayer.load();
        videoPlayer.addEventListener('error', handleVideoError);
    } else {
        handleVideoError();
    }
}

function loadIframeSource(url) {
    iframePlayer.src = url;
    iframePlayer.style.display = 'block';
}

function handleVideoError() {
    playerError.style.display = 'flex';
    console.error('Error loading video source');
}

function tryNextSource() {
    if (!currentMovie) return;
    
    const nextIndex = (currentSourceIndex + 1) % currentMovie.sources.length;
    sourceSelect.value = nextIndex;
    loadSource(nextIndex);
}

// ========================================
// Video Controls
// ========================================
function togglePlayPause() {
    if (videoPlayer.style.display === 'none') return;
    
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        videoPlayer.pause();
        playPauseBtn.textContent = '▶️';
    }
}

function toggleMute() {
    if (videoPlayer.style.display === 'none') return;
    
    videoPlayer.muted = !videoPlayer.muted;
    
    if (videoPlayer.muted) {
        muteBtn.textContent = '🔇';
        volumeSlider.value = 0;
        volumeValue.textContent = '0%';
    } else {
        muteBtn.textContent = '🔊';
        volumeSlider.value = videoPlayer.volume * 100;
        volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
    }
}

function updateProgress() {
    if (videoPlayer.duration) {
        const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressBar.value = progress;
        currentTime.textContent = formatTime(videoPlayer.currentTime);
        duration.textContent = formatTime(videoPlayer.duration);
    }
}

function seekVideo(e) {
    if (videoPlayer.style.display === 'none') return;
    
    const seekTime = (e.target.value / 100) * videoPlayer.duration;
    videoPlayer.currentTime = seekTime;
}

function changeVolume(e) {
    if (videoPlayer.style.display === 'none') return;
    
    const volume = e.target.value / 100;
    videoPlayer.volume = volume;
    volumeValue.textContent = Math.round(volume * 100) + '%';
    
    if (volume === 0) {
        videoPlayer.muted = true;
        muteBtn.textContent = '🔇';
    } else {
        videoPlayer.muted = false;
        muteBtn.textContent = '🔊';
    }
}

function changeSpeed(e) {
    if (videoPlayer.style.display === 'none') return;
    videoPlayer.playbackRate = parseFloat(e.target.value);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (playerContainer.requestFullscreen) {
            playerContainer.requestFullscreen();
        } else if (playerContainer.webkitRequestFullscreen) {
            playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.msRequestFullscreen) {
            playerContainer.msRequestFullscreen();
        }
        fullscreenBtn.textContent = '⛶';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullscreenBtn.textContent = '⛶';
    }
}

async function togglePiP() {
    if (videoPlayer.style.display === 'none') return;
    
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
            await videoPlayer.requestPictureInPicture();
        }
    } catch (error) {
        console.error('Picture-in-Picture error:', error);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ========================================
// Keyboard Shortcuts
// ========================================
function handleKeyboardShortcuts(e) {
    if (!movieModal.classList.contains('active')) return;
    if (videoPlayer.style.display === 'none') return;
    
    // Ignore if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    switch(e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'arrowleft':
            e.preventDefault();
            videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 5);
            break;
        case 'arrowright':
            e.preventDefault();
            videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 5);
            break;
        case 'arrowup':
            e.preventDefault();
            videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
            volumeSlider.value = videoPlayer.volume * 100;
            volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
            break;
        case 'arrowdown':
            e.preventDefault();
            videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
            volumeSlider.value = videoPlayer.volume * 100;
            volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
            break;
        case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'm':
            e.preventDefault();
            toggleMute();
            break;
    }
}

// ========================================
// Admin Panel Functions
// ========================================
function openAdminModal() {
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderManageMoviesList();
    adminModalClose.focus();
}

function closeAdminModal() {
    adminModal.classList.remove('active');
    document.body.style.overflow = '';
    resetMovieForm();
}

function switchTab(tabName) {
    // Remove active class from all tabs
    tabBtns.forEach(btn => btn.classList.remove('active'));
    addMovieTab.classList.remove('active');
    manageMoviesTab.classList.remove('active');
    
    // Add active class to selected tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'add') {
        addMovieTab.classList.add('active');
    } else if (tabName === 'manage') {
        manageMoviesTab.classList.add('active');
        renderManageMoviesList();
    }
}

// Source Management
function addSourceField() {
    sourceCounter++;
    const sourceItem = document.createElement('div');
    sourceItem.className = 'source-item';
    sourceItem.dataset.sourceId = sourceCounter;
    
    sourceItem.innerHTML = `
        <div class="source-item-header">
            <h4>Izvor ${sourceCounter}</h4>
            <button type="button" class="remove-source-btn" onclick="removeSourceField(${sourceCounter})">
                🗑️ Ukloni
            </button>
        </div>
        <div class="source-fields">
            <div class="form-group">
                <label>Naziv izvora</label>
                <input type="text" class="source-name" required placeholder="Izvor A">
            </div>
            <div class="form-group">
                <label>Tip izvora</label>
                <select class="source-type" required>
                    <option value="">Izaberite tip</option>
                    <option value="mp4">MP4 Video</option>
                    <option value="hls">HLS Stream</option>
                    <option value="iframe">Iframe Embed (YouTube/Vimeo)</option>
                </select>
            </div>
            <div class="form-group">
                <label>URL izvora</label>
                <input type="url" class="source-url" required placeholder="https://...">
            </div>
        </div>
    `;
    
    sourcesContainer.appendChild(sourceItem);
}

function removeSourceField(sourceId) {
    const sourceItem = document.querySelector(`[data-source-id="${sourceId}"]`);
    if (sourceItem) {
        sourceItem.remove();
    }
}

// Poster Preview
function updatePosterPreview() {
    const url = moviePosterInput.value.trim();
    if (url) {
        posterPreviewImg.src = url;
        posterPreview.style.display = 'block';
        
        posterPreviewImg.onerror = function() {
            posterPreview.style.display = 'none';
        };
    } else {
        posterPreview.style.display = 'none';
    }
}

// Form Handling
function resetMovieForm() {
    movieForm.reset();
    sourcesContainer.innerHTML = '';
    posterPreview.style.display = 'none';
    editingMovieId = null;
    sourceCounter = 0;
    saveMovieBtnText.textContent = '💾 Sačuvaj Film';
}

function getFormData() {
    const title = document.getElementById('movieTitle').value.trim();
    const year = parseInt(document.getElementById('movieYear').value);
    const duration = document.getElementById('movieDuration').value.trim();
    const genre = document.getElementById('movieGenre').value.trim();
    const description = document.getElementById('movieDescription').value.trim();
    const poster = moviePosterInput.value.trim();
    
    // Collect sources
    const sourceItems = sourcesContainer.querySelectorAll('.source-item');
    const sources = [];
    
    sourceItems.forEach(item => {
        const name = item.querySelector('.source-name').value.trim();
        const type = item.querySelector('.source-type').value;
        const url = item.querySelector('.source-url').value.trim();
        
        if (name && type && url) {
            sources.push({ name, type, url });
        }
    });
    
    return { title, year, duration, genre, description, poster, sources };
}

function saveMovie(e) {
    e.preventDefault();
    
    const formData = getFormData();
    
    // Validation
    if (formData.sources.length === 0) {
        alert('Morate dodati bar jedan izvor za film!');
        return;
    }
    
    const customMovies = getCustomMovies();
    
    if (editingMovieId) {
        // Update existing movie
        const movieIndex = customMovies.findIndex(m => m.id === editingMovieId);
        if (movieIndex !== -1) {
            customMovies[movieIndex] = {
                ...customMovies[movieIndex],
                ...formData
            };
        } else {
            // Movie is from default data, can't edit
            alert('Ne možete urediti default filmove. Možete dodati novi film.');
            return;
        }
    } else {
        // Add new movie
        const newMovie = {
            id: getNextMovieId(),
            ...formData
        };
        customMovies.push(newMovie);
    }
    
    saveMoviesToStorage(customMovies);
    loadMoviesFromStorage();
    populateFilters();
    renderMovies(allMovies);
    
    alert(editingMovieId ? 'Film je uspešno ažuriran!' : 'Film je uspešno dodat!');
    
    resetMovieForm();
    switchTab('manage');
}

// Manage Movies List
function renderManageMoviesList() {
    const searchTerm = manageSearchInput.value.toLowerCase();
    const customMovies = getCustomMovies();
    
    // Show all movies (both default and custom)
    let moviesToShow = allMovies;
    
    if (searchTerm) {
        moviesToShow = moviesToShow.filter(m => 
            m.title.toLowerCase().includes(searchTerm) ||
            m.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (moviesToShow.length === 0) {
        manageMoviesList.innerHTML = '<div class="no-movies-message">Nema filmova za prikaz.</div>';
        return;
    }
    
    manageMoviesList.innerHTML = '';
    
    moviesToShow.forEach(movie => {
        const isCustom = customMovies.some(m => m.id === movie.id);
        
        const movieItem = document.createElement('div');
        movieItem.className = 'manage-movie-item';
        
        movieItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="manage-movie-poster">
            <div class="manage-movie-info">
                <h4>${movie.title}</h4>
                <div class="manage-movie-meta">
                    ${movie.year} • ${movie.duration} • ${movie.genre}
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    ${movie.description.substring(0, 100)}...
                </p>
                ${!isCustom ? '<small style="color: var(--error-color);">Default film (ne može se brisati)</small>' : ''}
            </div>
            <div class="manage-movie-actions">
                ${isCustom ? `
                    <button class="edit-movie-btn" onclick="editMovie(${movie.id})">
                        ✏️ Uredi
                    </button>
                    <button class="delete-movie-btn" onclick="deleteMovie(${movie.id})">
                        🗑️ Obriši
                    </button>
                ` : `
                    <button class="edit-movie-btn" disabled style="opacity: 0.5; cursor: not-allowed;">
                        🔒 Zaključano
                    </button>
                `}
            </div>
        `;
        
        manageMoviesList.appendChild(movieItem);
    });
}

function editMovie(movieId) {
    const customMovies = getCustomMovies();
    const movie = customMovies.find(m => m.id === movieId);
    
    if (!movie) {
        alert('Možete uređivati samo filmove koje ste vi dodali!');
        return;
    }
    
    // Switch to add tab
    switchTab('add');
    
    // Populate form
    document.getElementById('movieTitle').value = movie.title;
    document.getElementById('movieYear').value = movie.year;
    document.getElementById('movieDuration').value = movie.duration;
    document.getElementById('movieGenre').value = movie.genre;
    document.getElementById('movieDescription').value = movie.description;
    moviePosterInput.value = movie.poster;
    updatePosterPreview();
    
    // Clear and populate sources
    sourcesContainer.innerHTML = '';
    sourceCounter = 0;
    
    movie.sources.forEach(source => {
        addSourceField();
        const lastSource = sourcesContainer.lastElementChild;
        lastSource.querySelector('.source-name').value = source.name;
        lastSource.querySelector('.source-type').value = source.type;
        lastSource.querySelector('.source-url').value = source.url;
    });
    
    editingMovieId = movieId;
    saveMovieBtnText.textContent = '💾 Ažuriraj Film';
}

function deleteMovie(movieId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj film?')) {
        return;
    }
    
    const customMovies = getCustomMovies();
    const filteredMovies = customMovies.filter(m => m.id !== movieId);
    
    saveMoviesToStorage(filteredMovies);
    loadMoviesFromStorage();
    populateFilters();
    renderMovies(allMovies);
    renderManageMoviesList();
    
    // Remove from favorites if present
    const favIndex = favorites.indexOf(movieId);
    if (favIndex !== -1) {
        favorites.splice(favIndex, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesCount();
    }
    
    alert('Film je uspešno obrisan!');
}

// ========================================
// Event Listeners
// ========================================
function attachEventListeners() {
    // Search and filters
    searchInput.addEventListener('input', filterMovies);
    genreFilter.addEventListener('change', filterMovies);
    yearFilter.addEventListener('change', filterMovies);
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Favorites
    showFavoritesBtn.addEventListener('click', showFavorites);
    toggleFavorite.addEventListener('click', () => {
        if (currentMovie) {
            toggleMovieFavorite(currentMovie.id);
        }
    });
    
    // Admin
    showAdminBtn.addEventListener('click', openAdminModal);
    adminModalClose.addEventListener('click', closeAdminModal);
    adminModalOverlay.addEventListener('click', closeAdminModal);
    
    // Admin tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    // Movie form
    movieForm.addEventListener('submit', saveMovie);
    addSourceBtn.addEventListener('click', addSourceField);
    cancelFormBtn.addEventListener('click', resetMovieForm);
    moviePosterInput.addEventListener('input', updatePosterPreview);
    
    // Manage movies search
    manageSearchInput.addEventListener('input', renderManageMoviesList);
    
    // Modal
    modalClose.addEventListener('click', closeMovieModal);
    modalOverlay.addEventListener('click', closeMovieModal);
    
    // Source selection
    sourceSelect.addEventListener('change', (e) => {
        loadSource(parseInt(e.target.value));
    });
    
    // Error handling
    tryAnotherSource.addEventListener('click', tryNextSource);
    
    // Video controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    muteBtn.addEventListener('click', toggleMute);
    progressBar.addEventListener('input', seekVideo);
    volumeSlider.addEventListener('input', changeVolume);
    speedControl.addEventListener('change', changeSpeed);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    pipBtn.addEventListener('click', togglePiP);
    
    // Video events
    videoPlayer.addEventListener('timeupdate', updateProgress);
    videoPlayer.addEventListener('loadedmetadata', updateProgress);
    videoPlayer.addEventListener('play', () => {
        playPauseBtn.textContent = '⏸️';
    });
    videoPlayer.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶️';
    });
    videoPlayer.addEventListener('ended', () => {
        playPauseBtn.textContent = '▶️';
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // ESC to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (movieModal.classList.contains('active')) {
                closeMovieModal();
            } else if (adminModal.classList.contains('active')) {
                closeAdminModal();
            }
        }
    });
    
    // Show/hide controls on hover (for touch devices, use click)
    let controlsTimeout;
    playerContainer.addEventListener('mousemove', () => {
        if (videoPlayer.style.display === 'none') return;
        
        videoControls.classList.add('show');
        clearTimeout(controlsTimeout);
        
        if (!videoPlayer.paused) {
            controlsTimeout = setTimeout(() => {
                videoControls.classList.remove('show');
            }, 3000);
        }
    });
    
    playerContainer.addEventListener('mouseleave', () => {
        if (videoPlayer.style.display === 'none') return;
        
        if (!videoPlayer.paused) {
            videoControls.classList.remove('show');
        }
    });
    
    // Click on video to toggle play/pause
    videoPlayer.addEventListener('click', togglePlayPause);
}

// ========================================
// Make functions globally accessible for inline event handlers
// ========================================
window.removeSourceField = removeSourceField;
window.editMovie = editMovie;
window.deleteMovie = deleteMovie;

// ========================================
// Initialize Application
// ========================================
document.addEventListener('DOMContentLoaded', init);

