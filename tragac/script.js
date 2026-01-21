// OMDb API Configuration
const OMDB_API_KEY = 'f8b1874a';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Cache object to store movie data
const movieCache = {};

// AI Survey System
let currentQuestionIndex = 0;
let aiAnswers = {};

// Movie recommendations storage
let currentMovieResults = [];
let currentMovieIndex = 0;

// Global set to track all shown movies in current session (prevents duplicates)
let shownMoviesSet = new Set();

// Movie search queries database - used to search OMDb API directly
// All movies are fetched from OMDb API in real-time, no local catalog
const movieSearchQueries = {
    'action': ['action', 'adventure', 'war', 'western', 'superhero', 'martial arts', 'spy', 'crime action'],
    'comedy': ['comedy', 'romantic comedy', 'dark comedy', 'satire', 'parody', 'slapstick'],
    'drama': ['drama', 'romance', 'biography', 'history', 'sport', 'musical'],
    'horror': ['horror', 'thriller horror', 'supernatural', 'zombie', 'vampire', 'monster'],
    'scifi': ['sci-fi', 'science fiction', 'fantasy', 'space', 'alien', 'future', 'dystopia'],
    'thriller': ['thriller', 'mystery', 'suspense', 'crime', 'psychological', 'neo-noir']
};

// Genre mapping for strict filtering
const genreMapping = {
    'action': ['Action', 'Adventure', 'War', 'Western'],
    'comedy': ['Comedy', 'Romance'],
    'drama': ['Drama', 'Biography', 'History', 'Sport', 'Musical'],
    'horror': ['Horror', 'Thriller'],
    'scifi': ['Sci-Fi', 'Science Fiction', 'Fantasy'],
    'thriller': ['Thriller', 'Mystery', 'Crime']
};

// Helper function to check if movie matches genre
function matchesGenre(movieDetails, targetGenre) {
    if (!movieDetails || !movieDetails.Genre || movieDetails.Genre === 'N/A') {
        return false;
    }
    
    const movieGenres = movieDetails.Genre.split(',').map(g => g.trim());
    const allowedGenres = genreMapping[targetGenre] || [];
    
    // Check if at least one genre matches
    return movieGenres.some(mg => 
        allowedGenres.some(ag => 
            mg.toLowerCase().includes(ag.toLowerCase()) || 
            ag.toLowerCase().includes(mg.toLowerCase())
        )
    );
}

// Extract keywords from plot for similarity comparison
function extractKeywords(text) {
    if (!text) return [];
    
    // Remove common words and extract meaningful keywords
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'his', 'her', 'its', 'our', 'their'];
    
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.includes(word));
    
    // Return unique keywords
    return [...new Set(words)];
}

// Calculate similarity between two texts based on shared keywords
function calculateSimilarity(keywords1, text2) {
    if (!keywords1 || keywords1.length === 0 || !text2) return 0;
    
    const keywords2 = extractKeywords(text2);
    const commonKeywords = keywords1.filter(kw => keywords2.includes(kw));
    
    // Return ratio of common keywords
    return commonKeywords.length / Math.max(keywords1.length, keywords2.length);
}


// AI Questions Database
const aiQuestions = [
    {
        id: 'type',
        question: 'Kakav film želiš da gledaš?',
        type: 'single',
        options: [
            { value: 'action', label: 'Akcija i avantura', icon: '⚡', keywords: ['action', 'adventure', 'thriller'] },
            { value: 'comedy', label: 'Komedija i zabava', icon: '😄', keywords: ['comedy', 'funny', 'humor'] },
            { value: 'drama', label: 'Drama i emocije', icon: '💔', keywords: ['drama', 'emotional', 'serious'] },
            { value: 'horror', label: 'Horor i napetost', icon: '👻', keywords: ['horror', 'scary', 'thriller'] },
            { value: 'scifi', label: 'Sci-Fi i fantastika', icon: '🚀', keywords: ['sci-fi', 'science fiction', 'fantasy'] },
            { value: 'thriller', label: 'Triler i misterija', icon: '🔍', keywords: ['thriller', 'mystery', 'suspense'] }
        ]
    },
    {
        id: 'mood',
        question: 'Kakvo je tvoje trenutno raspoloženje?',
        type: 'single',
        options: [
            { value: 'happy', label: 'Srećan/na - želim nešto zabavno', icon: '😊', keywords: ['comedy', 'fun', 'light'] },
            { value: 'sad', label: 'Tužan/na - želim emotivnu priču', icon: '😢', keywords: ['drama', 'emotional', 'touching'] },
            { value: 'excited', label: 'Uzbuđen/a - želim akciju!', icon: '🤩', keywords: ['action', 'adventure', 'exciting'] },
            { value: 'scared', label: 'Želim da se uplašim', icon: '😨', keywords: ['horror', 'scary', 'thriller'] },
            { value: 'thoughtful', label: 'Zamišljen/a - želim nešto duboko', icon: '🤔', keywords: ['drama', 'philosophical', 'deep'] },
            { value: 'relaxed', label: 'Opušten/a - bilo šta može', icon: '😌', keywords: ['comedy', 'light', 'easy'] }
        ]
    },
    {
        id: 'period',
        question: 'Koji period filma te zanima?',
        type: 'single',
        options: [
            { value: 'classic', label: 'Klasici (1970-1999)', icon: '📼', yearRange: '1970-1999', keywords: ['classic', 'vintage'] },
            { value: '2000s', label: '2000-te (2000-2009)', icon: '💿', yearRange: '2000-2009', keywords: ['2000s'] },
            { value: '2010s', label: '2010-te (2010-2019)', icon: '🎬', yearRange: '2010-2019', keywords: ['2010s', 'modern'] },
            { value: 'recent', label: 'Najnoviji (2020+)', icon: '🎥', yearRange: '2020-2025', keywords: ['recent', 'new', 'latest'] },
            { value: 'any', label: 'Bilo koji period', icon: '⏳', yearRange: 'any', keywords: [] }
        ]
    },
    {
        id: 'duration',
        question: 'Koliko dugo želiš da traje film?',
        type: 'single',
        options: [
            { value: 'short', label: 'Kratak (do 90 min)', icon: '⏱️', keywords: ['short'] },
            { value: 'medium', label: 'Srednji (90-120 min)', icon: '⏰', keywords: ['medium'] },
            { value: 'long', label: 'Dug (preko 120 min)', icon: '⏳', keywords: ['long', 'epic'] },
            { value: 'any', label: 'Nije važno', icon: '♾️', keywords: [] }
        ]
    },
    {
        id: 'rating',
        question: 'Da li želiš film sa visokom ocenom?',
        type: 'single',
        options: [
            { value: 'high', label: 'Da, samo najbolje (8.0+)', icon: '⭐', minRating: 8.0, keywords: ['high rating', 'best'] },
            { value: 'good', label: 'Dobro ocenjen (7.0+)', icon: '✨', minRating: 7.0, keywords: ['good rating'] },
            { value: 'any', label: 'Nije važno', icon: '🎭', minRating: 0, keywords: [] }
        ]
    },
    {
        id: 'popularity',
        question: 'Da li želiš poznat film ili nešto manje poznato?',
        type: 'single',
        options: [
            { value: 'popular', label: 'Poznat i popularan', icon: '🔥', keywords: ['popular', 'famous', 'blockbuster'] },
            { value: 'hidden', label: 'Manje poznat (hidden gem)', icon: '💎', keywords: ['hidden', 'gem', 'underrated'] },
            { value: 'any', label: 'Nije važno', icon: '🎲', keywords: [] }
        ]
    },
    {
        id: 'tone',
        question: 'Kakav ton filma preferiraš?',
        type: 'single',
        options: [
            { value: 'light', label: 'Lak i zabavan', icon: '☀️', keywords: ['light', 'fun', 'comedy'] },
            { value: 'serious', label: 'Ozbiljan i dubok', icon: '🎭', keywords: ['serious', 'drama', 'deep'] },
            { value: 'dark', label: 'Mračan i intenzivan', icon: '🌙', keywords: ['dark', 'intense', 'thriller'] },
            { value: 'any', label: 'Bilo koji', icon: '🌈', keywords: [] }
        ]
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
async function initializeApp() {
    // Initialize theme
    loadTheme();
    
    // Set current year dynamically
    setCurrentYear();
    
    // Add event listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Check if this is a page refresh (not initial load or shared link)
    const isRefresh = sessionStorage.getItem('pageLoaded') === 'true';
    sessionStorage.setItem('pageLoaded', 'true');
    
    // Check if URL contains movie parameter (shared link)
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movie');
    
    // If it's a refresh and we have a movie in session, restore it
    if (isRefresh && !movieId) {
        const savedMovieId = sessionStorage.getItem('currentMovieId');
        if (savedMovieId) {
            try {
                const movieDetails = await getMovieDetails(savedMovieId);
                currentMovie = movieDetails;
                displayMovie(movieDetails);
                return; // Don't initialize survey
            } catch (error) {
                console.error('Error restoring movie:', error);
                sessionStorage.removeItem('currentMovieId');
                // Continue to normal initialization
            }
        }
    }
    
    if (movieId) {
        // User came from a shared link - show the movie directly
        console.log('Loading shared movie:', movieId);
        showLoading();
        
        try {
            const movieDetails = await getMovieDetails(movieId);
            // Mark as shown to prevent duplicates
            shownMoviesSet.add(movieId);
            // Set current movie
            currentMovie = movieDetails;
            // Save to session for refresh
            sessionStorage.setItem('currentMovieId', movieId);
            // Display the movie
            displayMovie(movieDetails);
            
            // Add a button to start new search
            setTimeout(() => {
                const movieSection = document.getElementById('movieSection');
                if (movieSection) {
                    const actionButtons = movieSection.querySelector('.text-center');
                    if (actionButtons) {
                        const newSearchBtn = document.createElement('button');
                        newSearchBtn.className = 'btn btn-primary btn-lg mt-3';
                        newSearchBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Pronađi Svoj Film';
                        newSearchBtn.onclick = () => {
                            sessionStorage.removeItem('currentMovieId');
                            window.location.href = window.location.pathname; // Remove query params
                        };
                        actionButtons.appendChild(newSearchBtn);
                    }
                }
            }, 500);
            
            return; // Don't initialize survey if showing shared movie
        } catch (error) {
            console.error('Error loading shared movie:', error);
            showError('Film nije pronađen. Možda je link nevažeći.');
            sessionStorage.removeItem('currentMovieId');
            // Continue to normal initialization
        }
    }
    
    // Initialize AI Survey (normal flow)
    initializeAISurvey();
    
    console.log('FilmFinder AI aplikacija inicijalizovana!');
}

// Initialize AI Survey System
function initializeAISurvey() {
    currentQuestionIndex = 0;
    aiAnswers = {};
    document.getElementById('totalQuestions').textContent = aiQuestions.length;
    displayAIQuestion();
}

// Set current year in footer
function setCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        themeIcon.classList.remove('bi-sun-fill');
        themeIcon.classList.add('bi-moon-fill');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('themeIcon');
    
    // Dark mode je podrazumevani
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-moon-fill');
    } else {
        // Dark mode - set sun icon da se prebaci na light
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
    }
}

// Display AI Question
function displayAIQuestion() {
    const question = aiQuestions[currentQuestionIndex];
    const questionEl = document.getElementById('aiQuestion');
    const optionsEl = document.getElementById('answerOptions');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const findBtn = document.getElementById('findBtn');
    
    // Update question text
    questionEl.textContent = question.question;
    
    // Update question number
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / aiQuestions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Clear previous options
    optionsEl.innerHTML = '';
    
    // Generate options
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = window.innerWidth < 768 ? 'col-12 mb-2' : 'col-md-6 mb-3';
        
        const inputId = `option-${currentQuestionIndex}-${index}`;
        const isChecked = aiAnswers[question.id] === option.value;
        
        if (question.type === 'single') {
            optionDiv.innerHTML = `
                <input type="radio" class="btn-check" name="question-${currentQuestionIndex}" 
                       id="${inputId}" value="${option.value}" ${isChecked ? 'checked' : ''} 
                       onchange="selectAnswer('${question.id}', '${option.value}')">
                <label class="ai-option-card" for="${inputId}">
                    <span class="ai-option-icon">${option.icon}</span>
                    <span class="ai-option-label">${option.label}</span>
                </label>
            `;
        }
        
        optionsEl.appendChild(optionDiv);
    });
    
    // Show/hide navigation buttons
    prevBtn.classList.toggle('d-none', currentQuestionIndex === 0);
    
    if (currentQuestionIndex === aiQuestions.length - 1) {
        nextBtn.classList.add('d-none');
        findBtn.classList.remove('d-none');
    } else {
        nextBtn.classList.remove('d-none');
        findBtn.classList.add('d-none');
    }
}

// Select Answer
function selectAnswer(questionId, value) {
    aiAnswers[questionId] = value;
    console.log('AI Answer:', questionId, '=', value);
}

// Next AI Question
function nextAIQuestion() {
    const question = aiQuestions[currentQuestionIndex];
    
    // Validate answer
    if (!aiAnswers[question.id]) {
        alert('Molimo izaberite opciju pre nego što nastavite!');
        return;
    }
    
    if (currentQuestionIndex < aiQuestions.length - 1) {
        currentQuestionIndex++;
        displayAIQuestion();
    }
}

// Previous AI Question
function previousAIQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayAIQuestion();
    }
}

// Get movies from OMDb API directly based on AI answers
// Uses intelligent search with fallback system to always find minimum 5 movies
// Excludes movies that have already been shown in this session
async function getMoviesByPreferences(answers, minimum = 5) {
    let allResults = [];
    const seenIds = new Set(shownMoviesSet); // Start with already shown movies
    
    // Get primary genre/type
    const primaryType = answers.type || 'action';
    const searchQueries = movieSearchQueries[primaryType] || movieSearchQueries['action'];
    
    // Get year range if specified
    let yearFilter = null;
    if (answers.period && answers.period !== 'any') {
        switch (answers.period) {
            case 'classic':
                yearFilter = { start: 1970, end: 1999 };
                break;
            case '2000s':
                yearFilter = { start: 2000, end: 2009 };
                break;
            case '2010s':
                yearFilter = { start: 2010, end: 2019 };
                break;
            case 'recent':
                yearFilter = { start: 2020, end: 2025 };
                break;
        }
    }
    
    // Try multiple search queries until we have minimum results
    for (const query of searchQueries) {
        if (allResults.length >= minimum * 2) break; // Get more than minimum for filtering
        
        try {
            const results = await searchMovies(query);
            
            if (results && results.length > 0) {
                // Filter by year if specified
                let filtered = results;
                if (yearFilter) {
                    filtered = results.filter(m => {
                        const movieYear = parseInt(m.Year);
                        return !isNaN(movieYear) && movieYear >= yearFilter.start && movieYear <= yearFilter.end;
                    });
                }
                
                // Add only new movies (by imdbID)
                for (const movie of filtered) {
                    if (!seenIds.has(movie.imdbID)) {
                        seenIds.add(movie.imdbID);
                        allResults.push(movie);
                    }
                }
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
            
        } catch (error) {
            console.log('Error searching for:', query, error);
            // Continue with next query
        }
    }
    
    // If still not enough, try broader searches
    if (allResults.length < minimum) {
        // Try searching by popular movie titles in the genre
        const popularTitles = {
            'action': ['avengers', 'matrix', 'terminator', 'john wick', 'mad max', 'inception'],
            'comedy': ['hangover', 'superbad', 'deadpool', 'guardians galaxy', 'ted'],
            'drama': ['shawshank', 'forrest gump', 'godfather', 'titanic', 'gladiator'],
            'horror': ['conjuring', 'insidious', 'it', 'get out', 'exorcist'],
            'scifi': ['interstellar', 'blade runner', 'arrival', 'dune', 'matrix'],
            'thriller': ['gone girl', 'prisoners', 'se7en', 'shutter island', 'memento']
        };
        
        const titles = popularTitles[primaryType] || popularTitles['action'];
        for (const title of titles) {
            if (allResults.length >= minimum * 2) break;
            
            try {
                const results = await searchMovies(title);
                if (results && results.length > 0) {
                    for (const movie of results) {
                        if (!seenIds.has(movie.imdbID)) {
                            seenIds.add(movie.imdbID);
                            allResults.push(movie);
                        }
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.log('Error searching for title:', title, error);
            }
        }
    }
    
    // Now filter by actual genre from OMDb details (strict genre matching)
    // This ensures we only return movies that match the requested genre
    const genreFilteredResults = [];
    
    console.log(`Filtering ${allResults.length} results by genre: ${primaryType}`);
    
    for (const movie of allResults) {
        try {
            // Get full movie details to check genre
            const movieDetails = await getMovieDetails(movie.imdbID);
            
            // Check if movie matches the target genre
            if (matchesGenre(movieDetails, primaryType)) {
                genreFilteredResults.push(movie);
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // If we have enough, break early
            if (genreFilteredResults.length >= minimum * 2) {
                break;
            }
        } catch (error) {
            console.log('Error checking genre for movie:', movie.imdbID, error);
            // Skip this movie if we can't get details
        }
    }
    
    // If we don't have enough after genre filtering, use what we have
    let finalResults = genreFilteredResults.length >= minimum ? genreFilteredResults : allResults;
    
    // Shuffle for variety
    finalResults = finalResults.sort(() => Math.random() - 0.5);
    
    // Remove duplicates
    const uniqueResults = [];
    const seen = new Set();
    for (const movie of finalResults) {
        if (!seen.has(movie.imdbID)) {
            seen.add(movie.imdbID);
            uniqueResults.push(movie);
        }
    }
    
    console.log(`Returning ${uniqueResults.length} unique results for genre: ${primaryType}`);
    
    // Return minimum required, but up to 20 for variety
    return uniqueResults.slice(0, Math.max(minimum, 20));
}

// This function is no longer needed - we use OMDb API directly now

// Main Function: Find Movie
async function findMovie() {
    // Validate last question
    const lastQuestion = aiQuestions[aiQuestions.length - 1];
    if (!aiAnswers[lastQuestion.id]) {
        alert('Molimo izaberite opciju pre nego što nastavite!');
        return;
    }

    // Show loading
    showLoading();

    try {
        console.log('AI Answers:', aiAnswers);

        // Get candidates from OMDb API directly based 100% on parameters
        let candidates = await getMoviesByPreferences(aiAnswers, 5);

        // Ensure we have at least 5 movies - if not, try with more relaxed criteria
        if (!candidates || candidates.length < 5) {
            console.log('Not enough candidates, trying with relaxed criteria...');
            // Try with only genre requirement
            const relaxedAnswers = {
                type: aiAnswers.type || 'action',
                period: 'any',
                tone: 'any',
                popularity: 'any',
                mood: null,
                rating: 'any',
                duration: 'any'
            };
            candidates = await getMoviesByPreferences(relaxedAnswers, 5);
        }

        if (!candidates || candidates.length === 0) {
            throw new Error('Nažalost, trenutno nemamo filmove koji odgovaraju tvojim kriterijumima. Pokušaj da malo olabaviš izbor.');
        }

        // Ensure minimum 5 movies
        if (candidates.length < 5) {
            console.log('Still not enough, using all available candidates');
            // Use what we have, but log it
        }

        // Save for next recommendations
        currentMovieResults = candidates;
        currentMovieIndex = 0;

        // Save initial search to history (only once, before displaying first movie)
        if (aiAnswers && currentMovieResults && currentMovieResults.length > 0) {
            saveToHistory(aiAnswers, currentMovieResults).catch(error => {
                console.error('Error saving to history:', error);
            });
        }

        // Get first movie details to use as reference for similarity
        let firstMovieDetails = null;
        let referencePlot = null;
        
        // Get first movie
        firstMovieDetails = await getMovieDetails(candidates[0].imdbID);
        referencePlot = firstMovieDetails.Plot && firstMovieDetails.Plot !== 'N/A' 
            ? firstMovieDetails.Plot.toLowerCase() 
            : null;
        
        // If user traži film sa višom ocenom – probaj da nađeš najbolji među kandidatima
        if (aiAnswers.rating && aiAnswers.rating !== 'any') {
            const ratingQuestion = aiQuestions.find(q => q.id === 'rating');
            const ratingOption = ratingQuestion.options.find(opt => opt.value === aiAnswers.rating);
            if (ratingOption && ratingOption.minRating) {
                let bestMovie = null;
                let bestIndex = 0;
                for (let i = 0; i < Math.min(5, candidates.length); i++) {
                    try {
                        const movieDetails = await getMovieDetails(candidates[i].imdbID);
                        const rating = parseFloat(movieDetails.imdbRating);
                        if (!isNaN(rating) && rating >= ratingOption.minRating) {
                            bestMovie = movieDetails;
                            bestIndex = i;
                            break;
                        }
                    } catch (e) {
                        console.log('Skipping movie due to error:', e);
                    }
                }
                if (bestMovie) {
                    currentMovieIndex = bestIndex;
                    // Mark all candidates as shown (prevent duplicates in future searches)
                    candidates.forEach(m => shownMoviesSet.add(m.imdbID));
                    displayMovie(bestMovie);
                    return;
                }
            }
        }

        // Filter candidates by plot similarity if we have a reference plot
        if (referencePlot && candidates.length > 1) {
            const similarMovies = [];
            const plotKeywords = extractKeywords(referencePlot);
            
            // Check similarity for other candidates
            for (let i = 1; i < Math.min(candidates.length, 10); i++) {
                try {
                    const movieDetails = await getMovieDetails(candidates[i].imdbID);
                    const moviePlot = movieDetails.Plot && movieDetails.Plot !== 'N/A' 
                        ? movieDetails.Plot.toLowerCase() 
                        : '';
                    
                    if (moviePlot && calculateSimilarity(plotKeywords, moviePlot) > 0.2) {
                        similarMovies.push(candidates[i]);
                    }
                } catch (e) {
                    console.log('Error checking similarity:', e);
                }
            }
            
            // If we found similar movies, prioritize them
            if (similarMovies.length > 0) {
                // Reorder: similar movies first, then others
                const similarIds = new Set(similarMovies.map(m => m.imdbID));
                currentMovieResults = [
                    ...similarMovies,
                    ...candidates.filter(m => !similarIds.has(m.imdbID))
                ];
            }
        }
        
        // Mark all candidates as shown (prevent duplicates in future searches)
        candidates.forEach(m => shownMoviesSet.add(m.imdbID));
        
        displayMovie(firstMovieDetails);

    } catch (error) {
        showError(error.message);
        console.error('Greška:', error);
    }
}

// This function is no longer needed - we use getMoviesByPreferences directly

// Get movies with same preferences using OMDb API directly
async function getMoviesWithSamePreferences(answers, needed) {
    // Get movies using same logic (already excludes shownMoviesSet)
    const allResults = await getMoviesByPreferences(answers, needed * 2);
    
    // Filter out movies from current results
    const currentIds = new Set();
    if (currentMovieResults && currentMovieResults.length > 0) {
        currentMovieResults.forEach(m => currentIds.add(m.imdbID));
    }
    
    // Filter out already seen movies (both from current results and shownMoviesSet)
    const additionalResults = allResults.filter(m => !currentIds.has(m.imdbID));
    
    return additionalResults.slice(0, needed);
}

// Remove duplicate movies by imdbID
function removeDuplicates(movies) {
    const seen = new Set();
    return movies.filter(movie => {
        if (seen.has(movie.imdbID)) {
            return false;
        }
        seen.add(movie.imdbID);
        return true;
    });
}

// This function is no longer needed - we use getMoviesByPreferences directly

// Filter movies based on AI criteria using OMDb data
async function filterMoviesByAICriteria(results, answers) {
    if (!results || results.length === 0) return results;
    
    let filtered = [...results];
    
    // Filter by year if period is specified
    if (answers.period && answers.period !== 'any') {
        const periodQuestion = aiQuestions.find(q => q.id === 'period');
        const periodOption = periodQuestion.options.find(opt => opt.value === answers.period);
        if (periodOption && periodOption.yearRange && periodOption.yearRange !== 'any') {
            const [startYear, endYear] = periodOption.yearRange.split('-').map(y => parseInt(y));
            filtered = filtered.filter(movie => {
                const movieYear = parseInt(movie.Year);
                return !isNaN(movieYear) && movieYear >= startYear && movieYear <= endYear;
            });
        }
    }
    
    // Filter by genre/type - get genre from first movie and filter others
    if (filtered.length > 0 && answers.type) {
        // We'll filter by checking if movies match the selected type
        // This will be done by checking movie details later
    }
    
    // If filtering removed all results, return original
    return filtered.length > 0 ? filtered : results;
}

// Filter movies by detailed criteria (genre, rating, year) after getting details
async function filterMoviesByDetailedCriteria(movies, answers) {
    if (!movies || movies.length === 0) return movies;
    
    const filtered = [];
    
    // Get criteria
    let minRating = 0;
    if (answers.rating && answers.rating !== 'any') {
        const ratingQuestion = aiQuestions.find(q => q.id === 'rating');
        const ratingOption = ratingQuestion.options.find(opt => opt.value === answers.rating);
        if (ratingOption && ratingOption.minRating) {
            minRating = ratingOption.minRating;
        }
    }
    
    let yearRange = null;
    if (answers.period && answers.period !== 'any') {
        const periodQuestion = aiQuestions.find(q => q.id === 'period');
        const periodOption = periodQuestion.options.find(opt => opt.value === answers.period);
        if (periodOption && periodOption.yearRange && periodOption.yearRange !== 'any') {
            const [startYear, endYear] = periodOption.yearRange.split('-').map(y => parseInt(y));
            yearRange = { start: startYear, end: endYear };
        }
    }
    
    // Get expected genre from type - more precise matching
    const genreMap = {
        'action': ['Action'],
        'comedy': ['Comedy'],
        'drama': ['Drama'],
        'horror': ['Horror'],
        'scifi': ['Sci-Fi', 'Science Fiction'],
        'thriller': ['Thriller', 'Mystery']
    };
    const expectedGenres = genreMap[answers.type] || [];
    
    // Check each movie
    for (const movie of movies) {
        try {
            // Get full details to check genre and rating
            const details = await getMovieDetails(movie.imdbID);
            
            let matches = true;
            
            // Check rating
            if (minRating > 0) {
                const rating = parseFloat(details.imdbRating);
                if (isNaN(rating) || rating < minRating) {
                    matches = false;
                    continue; // Skip this movie
                }
            }
            
            // Check year
            if (yearRange) {
                const movieYear = parseInt(details.Year);
                if (isNaN(movieYear) || movieYear < yearRange.start || movieYear > yearRange.end) {
                    matches = false;
                    continue; // Skip this movie
                }
            }
            
            // Check genre - must have at least one matching genre
            if (expectedGenres.length > 0 && details.Genre && details.Genre !== 'N/A') {
                const movieGenres = details.Genre.split(',').map(g => g.trim().toLowerCase());
                const hasMatchingGenre = expectedGenres.some(eg => {
                    const expectedGenreLower = eg.toLowerCase();
                    return movieGenres.some(mg => 
                        mg === expectedGenreLower || 
                        mg.includes(expectedGenreLower) ||
                        expectedGenreLower.includes(mg)
                    );
                });
                if (!hasMatchingGenre) {
                    matches = false;
                    continue; // Skip this movie - doesn't match genre
                }
            } else if (expectedGenres.length > 0) {
                // If genre is required but not available, skip
                matches = false;
                continue;
            }
            
            // Only add if all criteria match
            if (matches) {
                filtered.push(movie);
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log('Error checking movie details:', error);
            // If we can't check details, don't include it (strict filtering)
            // This ensures only verified movies are included
        }
    }
    
    return filtered.length > 0 ? filtered : movies;
}

// Search movies using OMDb API
async function searchMovies(query) {
    try {
        // Check cache first
        const cacheKey = `search_${query}`;
        if (movieCache[cacheKey]) {
            console.log('Korišćenje cache-a za pretragu:', query);
            return movieCache[cacheKey];
        }
        
        // Sanitize and encode query
        const sanitizedQuery = sanitizeInput(query);
        const url = `${OMDB_BASE_URL}?s=${encodeURIComponent(sanitizedQuery)}&type=movie&apikey=${OMDB_API_KEY}`;
        
        console.log('Pretraga filmova:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        });
        
        if (!response.ok) {
            console.error('HTTP Status:', response.status);
            throw new Error(`API greška: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.Response === 'False') {
            throw new Error(data.Error || 'Film nije pronađen');
        }
        
        // Cache results
        movieCache[cacheKey] = data.Search;
        
        return data.Search;
        
    } catch (error) {
        console.error('Detaljna greška:', error);
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Nije moguće povezati se sa API-jem. Proveri internet konekciju ili pokušaj ponovo.');
        }
        throw new Error(`Greška pri pretraživanju filmova: ${error.message}`);
    }
}

// Get movie details by IMDb ID
async function getMovieDetails(imdbID) {
    try {
        // Check cache first
        const cacheKey = `details_${imdbID}`;
        if (movieCache[cacheKey]) {
            console.log('Korišćenje cache-a za detalje:', imdbID);
            return movieCache[cacheKey];
        }
        
        const url = `${OMDB_BASE_URL}?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`;
        
        console.log('Dohvatanje detalja filma:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        });
        
        if (!response.ok) {
            console.error('HTTP Status:', response.status);
            throw new Error(`API greška: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Movie Details:', data);
        
        if (data.Response === 'False') {
            throw new Error(data.Error || 'Detalji filma nisu dostupni');
        }
        
        // Cache results
        movieCache[cacheKey] = data;
        
        return data;
        
    } catch (error) {
        console.error('Detaljna greška:', error);
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Nije moguće povezati se sa API-jem. Proveri internet konekciju ili pokušaj ponovo.');
        }
        throw new Error(`Greška pri dohvatanju detalja filma: ${error.message}`);
    }
}

// Display movie information
function displayMovie(movie) {
    // Mark this movie as shown (prevent duplicates)
    if (movie && movie.imdbID) {
        shownMoviesSet.add(movie.imdbID);
    }
    
    // Mark this movie as shown (prevent duplicates)
    if (movie && movie.imdbID) {
        shownMoviesSet.add(movie.imdbID);
        // Save to session for refresh
        sessionStorage.setItem('currentMovieId', movie.imdbID);
    }
    
    // Hide loading and survey
    hideLoading();
    document.getElementById('surveySection').classList.add('d-none');
    document.getElementById('heroSection').classList.add('d-none');
    
    // Show movie section
    const movieSection = document.getElementById('movieSection');
    movieSection.classList.remove('d-none');
    
    // Set poster with fallback
    const posterImg = document.getElementById('moviePoster');
    if (movie.Poster && movie.Poster !== 'N/A') {
        posterImg.src = movie.Poster;
        posterImg.alt = movie.Title;
    } else {
        // Fallback poster
        posterImg.src = `https://via.placeholder.com/300x450/667eea/ffffff?text=${encodeURIComponent(movie.Title)}`;
        posterImg.alt = 'Movie Poster Not Available';
    }
    
    // Set movie information
    document.getElementById('movieTitle').textContent = movie.Title;
    document.getElementById('movieYear').textContent = movie.Year;
    document.getElementById('movieGenre').textContent = movie.Genre !== 'N/A' ? movie.Genre : 'Nepoznat žanr';
    document.getElementById('movieRuntime').textContent = movie.Runtime !== 'N/A' ? movie.Runtime : 'Nepoznato trajanje';
    // Set IMDb rating with link to IMDb page
    const ratingElement = document.getElementById('movieRating');
    if (movie.imdbRating && movie.imdbRating !== 'N/A' && movie.imdbID) {
        const imdbUrl = `https://www.imdb.com/title/${movie.imdbID}/`;
        ratingElement.innerHTML = `<a href="${imdbUrl}" target="_blank" rel="noopener noreferrer" class="text-decoration-none">${movie.imdbRating}/10 <i class="bi bi-box-arrow-up-right"></i></a>`;
    } else {
        ratingElement.textContent = 'Nema ocene';
    }
    // Translate plot to Serbian if needed
    const plotElement = document.getElementById('moviePlot');
    if (movie.Plot && movie.Plot !== 'N/A') {
        // Show original text first
        plotElement.textContent = movie.Plot;
        // Then translate
        translateToSerbian(movie.Plot).then(translatedPlot => {
            if (translatedPlot && translatedPlot !== movie.Plot) {
                plotElement.textContent = translatedPlot;
            }
        }).catch(error => {
            console.log('Translation error, using original:', error);
            // Keep original text if translation fails
        });
    } else {
        plotElement.textContent = 'Opis nije dostupan.';
    }
    document.getElementById('movieActors').textContent = movie.Actors !== 'N/A' ? movie.Actors : 'Nepoznati glumci';
    document.getElementById('movieDirector').textContent = movie.Director !== 'N/A' ? movie.Director : 'Nepoznat režiser';
    
    // Generate watch links
    const watchLinks = generateWatchLinks(movie.Title);
    displayWatchLinks(watchLinks);
    
    // Set trailer button
    const trailerBtn = document.getElementById('trailerBtn');
    if (trailerBtn) {
        trailerBtn.onclick = () => showTrailer();
    }
    
    // Set current movie for new features
    currentMovie = movie;
    
    // Check if movie is in favorites
    const favorites = getFavorites();
    const isFavorite = favorites.some(f => f.imdbID === movie.imdbID);
    
    const favoriteIcon = document.getElementById('favoriteIcon');
    const favoriteText = document.getElementById('favoriteText');
    
    if (favoriteIcon && favoriteText) {
        if (isFavorite) {
            favoriteIcon.classList.remove('bi-heart');
            favoriteIcon.classList.add('bi-heart-fill');
            favoriteText.textContent = 'Ukloni iz Favorita';
        } else {
            favoriteIcon.classList.remove('bi-heart-fill');
            favoriteIcon.classList.add('bi-heart');
            favoriteText.textContent = 'Dodaj u Favorite';
        }
    }
    
    // Add current movie to history (only if history entry exists)
    addMovieToHistory(movie);
    
    // Scroll to movie section
    movieSection.scrollIntoView({ behavior: 'smooth' });
}

// Generate watch links for streaming sites
function generateWatchLinks(movieTitle) {
    // Sanitize movie title
    const sanitizedTitle = sanitizeInput(movieTitle);
    
    return {
        filmotip: {
            name: 'FilmoTip',
            url: `https://filmotip.com/search2.php?keywords=${sanitizedTitle.replace(/ /g, '%2B')}&btn=Search`,
            icon: 'bi-film',
            color: 'primary'
        },
        onlinesaprevodom: {
            name: 'Online sa Prevodom',
            url: `https://onlinesaprevodom.net/?s=${sanitizedTitle.replace(/ /g, '+')}`,
            icon: 'bi-play-circle',
            color: 'success'
        },
        filmovitex: {
            name: 'FilmoviTex',
            url: `https://filmovitex.net/?s=${sanitizedTitle.replace(/ /g, '+')}&action=jws_ajax_search&post_type=movies`,
            icon: 'bi-camera-reels',
            color: 'warning'
        },
        filmoviplex: {
            name: 'FilmoviPlex',
            url: `https://www.filmoviplex.com/?all=all&s=${sanitizedTitle.replace(/ /g, '+')}&orderby=all`,
            icon: 'bi-collection-play',
            color: 'danger'
        }
    };
}

// Display watch links
function displayWatchLinks(links) {
    const watchLinksContainer = document.getElementById('watchLinks');
    watchLinksContainer.innerHTML = '';
    
    for (const [key, link] of Object.entries(links)) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        
        const button = document.createElement('a');
        button.href = link.url;
        button.target = '_blank';
        button.className = `btn btn-${link.color} w-100 watch-link-btn`;
        button.innerHTML = `<i class="${link.icon}"></i> ${link.name}`;
        
        col.appendChild(button);
        watchLinksContainer.appendChild(col);
    }
}

// Show loading state
function showLoading() {
    document.getElementById('surveySection').classList.add('d-none');
    document.getElementById('errorSection').classList.add('d-none');
    document.getElementById('movieSection').classList.add('d-none');
    document.getElementById('loadingSection').classList.remove('d-none');
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingSection').classList.add('d-none');
}

// Show error message
function showError(message) {
    hideLoading();
    document.getElementById('surveySection').classList.add('d-none');
    document.getElementById('movieSection').classList.add('d-none');
    
    const errorSection = document.getElementById('errorSection');
    document.getElementById('errorMessage').textContent = message;
    errorSection.classList.remove('d-none');
    
    errorSection.scrollIntoView({ behavior: 'smooth' });
}

// Get next movie recommendation from current results
async function getNextRecommendation() {
    if (!currentMovieResults || currentMovieResults.length === 0) {
        alert('Nema više preporuka. Pokušaj ponovo sa novom pretragom!');
        return;
    }
    
    // Move to next movie
    currentMovieIndex++;
    
    // If we've seen all movies, go back to start or show message
    if (currentMovieIndex >= currentMovieResults.length) {
        currentMovieIndex = 0; // Loop back to start
        // Or you could show a message: alert('Prikazujem ponovo prvi film iz liste!');
    }
    
    // Show loading
    showLoading();
    
    try {
        // Get next movie details
        const nextMovie = await getMovieDetails(currentMovieResults[currentMovieIndex].imdbID);
        
        // Add to history
        addMovieToHistory(nextMovie);
        
        // Display movie
        displayMovie(nextMovie);
        
    } catch (error) {
        // If error, try next movie
        if (currentMovieIndex < currentMovieResults.length - 1) {
            currentMovieIndex++;
            const nextMovie = await getMovieDetails(currentMovieResults[currentMovieIndex].imdbID);
            displayMovie(nextMovie);
        } else {
            showError('Nema više dostupnih filmova u ovoj pretrazi.');
        }
    }
}

// Reset application
function resetApp() {
    // Reset AI survey
    initializeAISurvey();
    
    // Reset movie results
    currentMovieResults = [];
    currentMovieIndex = 0;
    
    // Clear shown movies set (start fresh for new search)
    shownMoviesSet.clear();
    
    // Clear session storage
    sessionStorage.removeItem('currentMovieId');
    
    // Hide all sections except survey
    document.getElementById('loadingSection').classList.add('d-none');
    document.getElementById('errorSection').classList.add('d-none');
    document.getElementById('movieSection').classList.add('d-none');
    
    // Show survey section and hero
    document.getElementById('heroSection').classList.remove('d-none');
    document.getElementById('surveySection').classList.remove('d-none');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Input sanitization and validation
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    
    // Remove potentially harmful characters
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/[^\w\s\-:.']/g, '') // Keep only alphanumeric, spaces, hyphens, colons, periods, apostrophes
        .substring(0, 100); // Limit length
}

// ============================================
// NEW FEATURES IMPLEMENTATION
// ============================================

// Current movie being displayed
let currentMovie = null;

// Initialize new features - called after DOM is loaded
function initializeNewFeatures() {
    // Add event listeners for new buttons
    const favoritesBtn = document.getElementById('favoritesBtn');
    const historyBtn = document.getElementById('historyBtn');
    const statsBtn = document.getElementById('statsBtn');
    
    if (favoritesBtn) favoritesBtn.addEventListener('click', showFavorites);
    if (historyBtn) historyBtn.addEventListener('click', showHistory);
    if (statsBtn) statsBtn.addEventListener('click', showStatistics);
    
    // Load favorites count
    updateFavoritesCount();
}

// Call after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNewFeatures);
} else {
    initializeNewFeatures();
}

// ========== FAVORITES / WATCHLIST SYSTEM ==========
function getFavorites() {
    const favorites = localStorage.getItem('movieFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

function toggleFavorite() {
    if (!currentMovie) return;
    
    const favorites = getFavorites();
    const movieId = currentMovie.imdbID;
    const index = favorites.findIndex(f => f.imdbID === movieId);
    
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        document.getElementById('favoriteIcon').classList.remove('bi-heart-fill');
        document.getElementById('favoriteIcon').classList.add('bi-heart');
        document.getElementById('favoriteText').textContent = 'Dodaj u Favorite';
        alert('Film uklonjen iz favorita!');
    } else {
        // Add to favorites
        favorites.push({
            imdbID: currentMovie.imdbID,
            Title: currentMovie.Title,
            Year: currentMovie.Year,
            Poster: currentMovie.Poster,
            savedAt: new Date().toISOString()
        });
        document.getElementById('favoriteIcon').classList.remove('bi-heart');
        document.getElementById('favoriteIcon').classList.add('bi-heart-fill');
        document.getElementById('favoriteText').textContent = 'Ukloni iz Favorita';
        alert('Film dodat u favorite!');
    }
    
    saveFavorites(favorites);
}

function updateFavoritesCount() {
    const favorites = getFavorites();
    const count = favorites.length;
    const btn = document.getElementById('favoritesBtn');
    if (count > 0) {
        btn.innerHTML = `<i class="bi bi-heart-fill"></i> <span class="d-none d-md-inline">Favoriti (${count})</span>`;
    }
}

async function showFavorites() {
    const favorites = getFavorites();
    const modal = new bootstrap.Modal(document.getElementById('favoritesModal'));
    const listEl = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        listEl.innerHTML = '<p class="text-center text-muted">Nemate sačuvanih filmova u favoritima.</p>';
        modal.show();
        return;
    }
    
    listEl.innerHTML = '<div class="row g-3">';
    
    for (const fav of favorites) {
        try {
            const details = await getMovieDetails(fav.imdbID);
            listEl.innerHTML += `
                <div class="col-md-6">
                    <div class="card">
                        <div class="row g-0">
                            <div class="col-4">
                                <img src="${details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/150'}" class="img-fluid rounded-start" alt="${details.Title}">
                            </div>
                            <div class="col-8">
                                <div class="card-body">
                                    <h6 class="card-title">${details.Title} (${details.Year})</h6>
                                    <p class="card-text small text-muted">${details.imdbRating !== 'N/A' ? '⭐ ' + details.imdbRating : ''}</p>
                                    <button class="btn btn-sm btn-primary" onclick="viewMovieFromFavorites('${details.imdbID}')">Pogledaj</button>
                                    <button class="btn btn-sm btn-danger" onclick="removeFromFavorites('${details.imdbID}')">Ukloni</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading favorite:', error);
        }
    }
    
    listEl.innerHTML += '</div>';
    modal.show();
}

async function viewMovieFromFavorites(imdbID) {
    const movie = await getMovieDetails(imdbID);
    displayMovie(movie);
    bootstrap.Modal.getInstance(document.getElementById('favoritesModal')).hide();
}

function removeFromFavorites(imdbID) {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.imdbID !== imdbID);
    saveFavorites(filtered);
    showFavorites(); // Refresh
}

// ========== HISTORY SYSTEM ==========
function getHistory() {
    const history = localStorage.getItem('movieHistory');
    return history ? JSON.parse(history) : [];
}

// Add a single movie to history with link (only once, no duplicates)
function addMovieToHistory(movie) {
    if (!movie || !movie.imdbID || !movie.Title) return;
    
    const history = getHistory();
    
    // Find the most recent history entry (last search)
    if (history.length > 0) {
        const lastEntry = history[0];
        
        // Initialize movies array if it doesn't exist
        if (!lastEntry.movies) {
            lastEntry.movies = [];
        }
        
        // Check if this movie is already in the list (by imdbID)
        const exists = lastEntry.movies.some(m => m.imdbID === movie.imdbID);
        
        if (!exists) {
            // Add movie with link (only if it doesn't exist)
            lastEntry.movies.push({
                imdbID: movie.imdbID,
                Title: movie.Title,
                link: `${window.location.origin}${window.location.pathname}?movie=${movie.imdbID}`
            });
            
            // Update localStorage
            localStorage.setItem('movieHistory', JSON.stringify(history));
        }
    }
}

// Save initial search to history (only once per search)
async function saveToHistory(answers, results) {
    const history = getHistory();
    
    // Check if we already have an entry for this exact search (by timestamp and answers)
    // This prevents creating duplicate entries if saveToHistory is called multiple times
    const recentEntry = history[0];
    const now = new Date().toISOString();
    const timeDiff = recentEntry ? new Date(now) - new Date(recentEntry.timestamp) : Infinity;
    
    // Only create new entry if last entry is older than 2 seconds (new search)
    if (!recentEntry || timeDiff > 2000) {
        history.unshift({
            timestamp: now,
            answers: { ...answers },
            resultsCount: results.length,
            movies: [] // Will be populated as movies are displayed
        });
        
        // Keep only last 20 entries
        if (history.length > 20) {
            history.pop();
        }
        
        localStorage.setItem('movieHistory', JSON.stringify(history));
    }
}

function showHistory() {
    const history = getHistory();
    const modal = new bootstrap.Modal(document.getElementById('historyModal'));
    const listEl = document.getElementById('historyList');
    
    if (history.length === 0) {
        listEl.innerHTML = '<p class="text-center text-muted py-4">Nemate istorije preporuka.</p>';
        modal.show();
        return;
    }
    
    listEl.innerHTML = '';
    
    history.forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        const typeLabels = {
            'action': 'Akcija',
            'comedy': 'Komedija',
            'drama': 'Drama',
            'horror': 'Horor',
            'scifi': 'Sci-Fi',
            'thriller': 'Triler'
        };
        
        const genre = typeLabels[entry.answers.type] || 'Film';
        const formattedDate = date.toLocaleDateString('sr-RS', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Get movies from history entry (new format with links)
        const movies = entry.movies || [];
        // Fallback to old format if needed
        const movieTitles = entry.movieTitles || (entry.firstMovie ? [entry.firstMovie] : []);
        
        // Remove duplicates by imdbID (for movies) or by title (for old format)
        let uniqueMovies = [];
        if (movies.length > 0) {
            const seenIds = new Set();
            for (const movie of movies) {
                if (movie.imdbID && !seenIds.has(movie.imdbID)) {
                    seenIds.add(movie.imdbID);
                    uniqueMovies.push(movie);
                }
            }
        }
        
        let uniqueTitles = [];
        if (movieTitles.length > 0) {
            uniqueTitles = [...new Set(movieTitles)];
        }
        
        const item = document.createElement('div');
        item.className = 'list-group-item list-group-item-action';
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${genre}</h6>
                    ${uniqueMovies.length > 0 ? `
                        <div class="mb-1">
                            ${uniqueMovies.map(movie => `
                                <p class="mb-0 small">
                                    <a href="${movie.link}" class="text-decoration-none">${movie.Title}</a>
                                </p>
                            `).join('')}
                        </div>
                    ` : uniqueTitles.length > 0 ? `
                        <div class="mb-1">
                            ${uniqueTitles.map(title => `<p class="mb-0 small">${title}</p>`).join('')}
                        </div>
                    ` : ''}
                    <small class="text-muted">${formattedDate}</small>
                </div>
                <button class="btn btn-sm btn-outline-primary ms-3" onclick="restoreFromHistory(${index})">
                    <i class="bi bi-arrow-repeat"></i> Ponovi
                </button>
            </div>
        `;
        
        listEl.appendChild(item);
    });
    
    modal.show();
}

function restoreFromHistory(index) {
    const history = getHistory();
    if (history[index]) {
        aiAnswers = { ...history[index].answers };
        findMovie();
        bootstrap.Modal.getInstance(document.getElementById('historyModal')).hide();
    }
}

// ========== SORTING SYSTEM ==========
let sortedResults = [];

async function sortResults() {
    const sortValue = document.getElementById('sortSelect').value;
    if (!currentMovieResults || currentMovieResults.length === 0) return;
    
    // Get all movie details for sorting
    const moviesWithDetails = [];
    for (const movie of currentMovieResults) {
        try {
            const details = await getMovieDetails(movie.imdbID);
            moviesWithDetails.push(details);
        } catch (error) {
            console.error('Error getting details for sorting:', error);
        }
    }
    
    // Sort based on selected option
    const [sortBy, order] = sortValue.split('-');
    
    moviesWithDetails.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortBy) {
            case 'rating':
                aVal = parseFloat(a.imdbRating) || 0;
                bVal = parseFloat(b.imdbRating) || 0;
                break;
            case 'year':
                aVal = parseInt(a.Year) || 0;
                bVal = parseInt(b.Year) || 0;
                break;
            case 'runtime':
                const aRuntime = parseInt(a.Runtime) || 0;
                const bRuntime = parseInt(b.Runtime) || 0;
                aVal = aRuntime;
                bVal = bRuntime;
                break;
            default:
                return 0;
        }
        
        if (order === 'desc') {
            return bVal - aVal;
        } else {
            return aVal - bVal;
        }
    });
    
    // Update current results
    currentMovieResults = moviesWithDetails.map(m => ({
        imdbID: m.imdbID,
        Year: m.Year
    }));
    
    // Display first movie from sorted list
    if (moviesWithDetails.length > 0) {
        currentMovieIndex = 0;
        displayMovie(moviesWithDetails[0]);
    }
}

// ========== SHARE SYSTEM ==========
function toggleShareButtons() {
    const shareButtons = document.getElementById('shareButtons');
    if (shareButtons) {
        shareButtons.classList.toggle('d-none');
    }
}

function getShareUrl() {
    // If sharing a movie, include movie ID in URL
    if (currentMovie && currentMovie.imdbID) {
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?movie=${currentMovie.imdbID}`;
    }
    return window.location.href;
}

function getShareText() {
    if (!currentMovie) {
        return '🎬 FilmFinder - Pronađi savršen film za sebe!\n\nOdgovori na nekoliko pitanja i dobij personalizovane preporuke filmova koje ćeš voleti.\n\nBesplatno, brzo i jednostavno!\n\n';
    }
    return `🎬 Preporučujem film: ${currentMovie.Title} (${currentMovie.Year})\n\n${currentMovie.Plot ? currentMovie.Plot.substring(0, 150) + '...' : 'Odličan film!'}\n\nPronađi i ti svoj savršen film na FilmFinder!\n\n`;
}

function shareToFacebook(event) {
    event.preventDefault();
    if (!currentMovie) return;
    
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareToTwitter(event) {
    event.preventDefault();
    if (!currentMovie) return;
    
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareToWhatsApp(event) {
    event.preventDefault();
    if (!currentMovie) return;
    
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    const shareUrl = `https://wa.me/?text=${text}%20${url}`;
    window.open(shareUrl, '_blank');
}

function shareToTelegram(event) {
    event.preventDefault();
    if (!currentMovie) return;
    
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank');
}

function shareToEmail(event) {
    event.preventDefault();
    if (!currentMovie) return;
    
    const subject = encodeURIComponent(`Preporuka filma: ${currentMovie.Title}`);
    const body = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}

function copyLink(event) {
    event.preventDefault();
    const url = getShareUrl();
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link je kopiran u clipboard!');
        }).catch(err => {
            console.error('Error copying:', err);
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Link je kopiran u clipboard!');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Neuspešno kopiranje. Link: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Legacy function for backward compatibility
function shareMovie() {
    if (!currentMovie) return;
    
    const shareData = {
        title: `${currentMovie.Title} (${currentMovie.Year})`,
        text: getShareText(),
        url: getShareUrl()
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: show share buttons
        toggleShareButtons();
    }
}

// ========== FILTERS SYSTEM ==========
function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    panel.classList.toggle('d-none');
}

async function applyFilters() {
    if (!currentMovieResults || currentMovieResults.length === 0) {
        alert('Nema rezultata za filtriranje!');
        return;
    }
    
    const minRating = parseFloat(document.getElementById('ratingFilter').value);
    const yearFrom = document.getElementById('yearFrom').value ? parseInt(document.getElementById('yearFrom').value) : null;
    const yearTo = document.getElementById('yearTo').value ? parseInt(document.getElementById('yearTo').value) : null;
    const duration = document.getElementById('durationFilter').value;
    
    // Filter movies
    const filtered = [];
    for (const movie of currentMovieResults) {
        try {
            const details = await getMovieDetails(movie.imdbID);
            let matches = true;
            
            // Check rating
            if (minRating > 0) {
                const rating = parseFloat(details.imdbRating);
                if (isNaN(rating) || rating < minRating) matches = false;
            }
            
            // Check year
            if (yearFrom || yearTo) {
                const movieYear = parseInt(details.Year);
                if (yearFrom && movieYear < yearFrom) matches = false;
                if (yearTo && movieYear > yearTo) matches = false;
            }
            
            // Check duration
            if (duration !== 'any') {
                const runtime = parseInt(details.Runtime) || 0;
                if (duration === 'short' && runtime > 90) matches = false;
                if (duration === 'medium' && (runtime <= 90 || runtime > 120)) matches = false;
                if (duration === 'long' && runtime <= 120) matches = false;
            }
            
            if (matches) filtered.push(movie);
        } catch (error) {
            console.error('Error filtering movie:', error);
        }
    }
    
    if (filtered.length === 0) {
        alert('Nema filmova koji odgovaraju filterima!');
        return;
    }
    
    currentMovieResults = filtered;
    currentMovieIndex = 0;
    
    // Display first filtered movie
    const firstMovie = await getMovieDetails(filtered[0].imdbID);
    displayMovie(firstMovie);
    
    // Hide filters panel
    document.getElementById('filtersPanel').classList.add('d-none');
}

function resetFilters() {
    document.getElementById('ratingFilter').value = 0;
    document.getElementById('ratingValue').textContent = '0';
    document.getElementById('yearFrom').value = '';
    document.getElementById('yearTo').value = '';
    document.getElementById('durationFilter').value = 'any';
}

// ========== TRAILER SYSTEM ==========
async function showTrailer() {
    if (!currentMovie) return;
    
    const modal = new bootstrap.Modal(document.getElementById('trailerModal'));
    const container = document.getElementById('trailerContainer');
    
    container.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Učitavanje...</span></div>';
    modal.show();
    
    // Search YouTube for trailer
    const searchQuery = `${currentMovie.Title} ${currentMovie.Year} trailer`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    
    container.innerHTML = `
        <p>Trailer za "${currentMovie.Title}"</p>
        <a href="${youtubeUrl}" target="_blank" class="btn btn-danger btn-lg">
            <i class="bi bi-youtube"></i> Otvori Trailer na YouTube
        </a>
        <p class="mt-3 small text-muted">Klikni na dugme da otvoriš trailer na YouTube-u</p>
    `;
}

// ========== STATISTICS SYSTEM ==========
function showStatistics() {
    const history = getHistory();
    const favorites = getFavorites();
    
    const modal = new bootstrap.Modal(document.getElementById('statsModal'));
    const content = document.getElementById('statsContent');
    
    // Calculate statistics
    const genreCounts = {};
    const moodCounts = {};
    const periodCounts = {};
    
    history.forEach(entry => {
        if (entry.answers.type) {
            genreCounts[entry.answers.type] = (genreCounts[entry.answers.type] || 0) + 1;
        }
        if (entry.answers.mood) {
            moodCounts[entry.answers.mood] = (moodCounts[entry.answers.mood] || 0) + 1;
        }
        if (entry.answers.period) {
            periodCounts[entry.answers.period] = (periodCounts[entry.answers.period] || 0) + 1;
        }
    });
    
    const genreLabels = {
        'action': 'Akcija',
        'comedy': 'Komedija',
        'drama': 'Drama',
        'horror': 'Horor',
        'scifi': 'Sci-Fi',
        'thriller': 'Triler'
    };
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <h6><i class="bi bi-film"></i> Ukupno Pretraga</h6>
                <h3>${history.length}</h3>
            </div>
            <div class="col-md-6 mb-3">
                <h6><i class="bi bi-heart"></i> Sačuvani Favoriti</h6>
                <h3>${favorites.length}</h3>
            </div>
        </div>
        <hr>
        <h6>Najtraženiji Žanr:</h6>
        <p>${Object.keys(genreCounts).length > 0 ? genreLabels[Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0]] : 'N/A'}</p>
        <h6>Najčešće Raspoloženje:</h6>
        <p>${Object.keys(moodCounts).length > 0 ? (() => {
            const moodLabels = {
                'happy': 'Srećan/na',
                'sad': 'Tužan/na',
                'excited': 'Uzbuđen/a',
                'scared': 'Uplašen/a',
                'thoughtful': 'Zamišljen/a',
                'relaxed': 'Opušten/a'
            };
            const topMood = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0];
            return moodLabels[topMood] || topMood;
        })() : 'N/A'}</p>
        <h6>Omiljeni Period:</h6>
        <p>${Object.keys(periodCounts).length > 0 ? (() => {
            const periodLabels = {
                'classic': 'Klasici (1970-1999)',
                '2000s': '2000-te',
                '2010s': '2010-te',
                'recent': 'Najnoviji (2020+)',
                'any': 'Bilo koji'
            };
            const topPeriod = Object.keys(periodCounts).sort((a, b) => periodCounts[b] - periodCounts[a])[0];
            return periodLabels[topPeriod] || topPeriod;
        })() : 'N/A'}</p>
    `;
    
    modal.show();
}

// Functions are already integrated into displayMovie above

// Summarize long text to approximately 500 characters
function summarizeText(text, maxLength = 500) {
    if (!text || text.length <= maxLength) {
        return text;
    }
    
    // Try to cut at sentence boundary
    const truncated = text.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastExclamation = truncated.lastIndexOf('!');
    const lastQuestion = truncated.lastIndexOf('?');
    
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > maxLength * 0.7) {
        // Cut at sentence boundary if it's not too early
        return text.substring(0, lastSentenceEnd + 1);
    } else {
        // Cut at word boundary
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > maxLength * 0.7) {
            return text.substring(0, lastSpace) + '...';
        } else {
            return truncated + '...';
        }
    }
}

// Translate text to Serbian (Latin) using MyMemory Translation API
async function translateToSerbian(text) {
    if (!text || text === 'N/A' || text.trim().length === 0) {
        return text;
    }
    
    // Summarize if text is longer than 500 characters
    let textToTranslate = text;
    if (text.length > 500) {
        textToTranslate = summarizeText(text, 500);
        console.log('Text summarized from', text.length, 'to', textToTranslate.length, 'characters');
    }
    
    try {
        // Use MyMemory Translation API (free, no API key required for basic use)
        // Translate to Serbian Latin (sr-Latn)
        const encodedText = encodeURIComponent(textToTranslate);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|sr-Latn`;
        
        console.log('Translating text:', textToTranslate.substring(0, 50) + '...');
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Translation response:', data);
        
        if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
            let translated = data.responseData.translatedText;
            
            // Clean up translation (sometimes API returns extra text)
            if (translated.includes('MYMEMORY WARNING')) {
                // Extract actual translation from warning message
                const match = translated.match(/MYMEMORY WARNING.*?([A-Z].*)/s);
                if (match && match[1]) {
                    translated = match[1].trim();
                }
            }
            
            // If text was summarized, add note
            if (text.length > 500 && translated) {
                translated = translated.trim();
                // Ensure it ends properly
                if (!translated.endsWith('.') && !translated.endsWith('!') && !translated.endsWith('?')) {
                    translated += '...';
                }
            }
            
            console.log('Translation successful:', translated.substring(0, 50) + '...');
            return translated;
        } else {
            console.error('Translation API returned error:', data);
            throw new Error(`Translation failed: ${data.responseStatus || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Translation error:', error);
        // If translation fails and text was summarized, return summarized original
        if (text.length > 500) {
            return summarizeText(text, 500);
        }
        // Return original text if translation fails
        return text;
    }
}

// Console welcome message
console.log('%cFilmFinder 🎬', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cPronađi savršen film za sebe!', 'color: #764ba2; font-size: 14px;');
console.log('%cPowered by OMDb API', 'color: #6c757d; font-size: 12px;');


