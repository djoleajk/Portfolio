document.addEventListener("DOMContentLoaded", function () {
	const yearFilter = document.getElementById("year-filter");
	const genreFilter = document.getElementById("genre-filter");

	function loadMovies(year = "", genre = "") {
		console.log("Loading movies with filters:", { year, genre });
		fetch(`handlers/get-movies.php?year=${year}&genre=${genre}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				console.log("Received movies:", data);
				const container = document.getElementById("movies-container");
				container.innerHTML = "";

				if (data.length === 0) {
					container.innerHTML = "<p>Nema pronađenih filmova.</p>";
					return;
				}

				data.forEach((movie) => {
					const movieElement = createMovieElement(movie);
					container.appendChild(movieElement);
				});
			})
			.catch((error) => {
				console.error("Error loading movies:", error);
				document.getElementById("movies-container").innerHTML =
					"<p>Došlo je do greške prilikom učitavanja filmova.</p>";
			});
	}

	function createMovieElement(movie) {
		const div = document.createElement("div");
		div.className = "movie-card";
		div.innerHTML = `
            <img src="uploads/${movie.poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.year} | ${movie.genre}</p>
            <a href="player.php?id=${movie.id}">Gledaj Film</a>
        `;
		return div;
	}

	yearFilter.addEventListener("change", () => {
		loadMovies(yearFilter.value, genreFilter.value);
	});

	genreFilter.addEventListener("change", () => {
		loadMovies(yearFilter.value, genreFilter.value);
	});

loadMovies();
});
