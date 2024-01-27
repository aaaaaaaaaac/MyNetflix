const apikey = "667452effe844ba32e7154ffad81f2c7";
const apiEndpnt = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const utube_api = "AIzaSyDbjoJe6KFhrIlnoe1j76wRq33Sy0PB6AM";

const apipath = {
    // Endpoint to fetch all movie categories/genres
    fetchALlcategories: `${apiEndpnt}/genre/movie/list?api_key=${apikey}`,

    // Function to fetch movie list based on a specific genre ID
    fetchMovieList: (id) => `${apiEndpnt}/discover/movie?api_key=${apikey}&with_genres=${id}`,

    fetchTrending: `${apiEndpnt}/trending/all/day?api_key=${apikey}&language=en-US`,

    searchtrailer: (searchquery) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchquery}&key=${utube_api}`
}

function init() {
    fetchtrendingmovie();
    // buildndfetchmovieSection(apipath.fetchTrending, 'Trending Now');
    fetchallcategories();
}

function fetchtrendingmovie() {
    buildndfetchmovieSection(apipath.fetchTrending, 'Trending Now')
        .then(list => {
            const randonIndex = parseInt(Math.random() * list.length);
            buiuldbannersection(list[randonIndex])
        }).catch(err => {
            // console.error(err);
        });
}

function buiuldbannersection(movie) {
    const bannercontainer = document.getElementById('banner-section');
    bannercontainer.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
    const div = document.createElement('div');

    div.innerHTML = `<h2 class="banner-title">${movie.original_title}</h2>
    <p class="banner-descp">Trending in movies |Release Date :: ${movie.release_date}</p>
    <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + '...' : movie.overview}</p>
    <div class="action-Button-cont">
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
                <path
                    d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                    fill="currentColor"></path>
            </svg> &nbsp;&nbsp;Play</button>
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                    fill="currentColor"></path>
            </svg>&nbsp;&nbsp;More Info</button>
    </div>`
    div.className = "banner-content container";
    bannercontainer.append(div);
}

function fetchallcategories() {
    fetch(apipath.fetchALlcategories)
        .then(res => res.json())
        .then(res => {
            const category = res.genres;
            if (Array.isArray(category) && category.length) {
                category.forEach(category => {
                    buildndfetchmovieSection(apipath.fetchMovieList(category.id), category.name);
                });
            }
            // console.table(category.name);
        })
}

function buildndfetchmovieSection(fetchUrl, categoryName) {
    // console.log(fetchUrl, categoryName)
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results);
            const moviea = res.results;
            if (Array.isArray(moviea) && moviea.length) {
                buildmoviesSection(moviea, categoryName);
            }
            return moviea;
        })
    // .catch(err => console.error(err))
}
function buildmoviesSection(list, categoryName) {
    // console.log(list, categoryName);

    const moviesCOnt = document.getElementById('contan-movies');

    const movieslistHTML = list.map(item => {
        return `
        <div class="movie-item">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.original_title}" onclick="searchmovietrailer('${item.original_title} trailer')">
        <iframe width="245px" height="150px" src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1"></iframe>
        </div>`;
        // /tgbNymZ7vqY?autoplay=1&mute=1
    }).join('');
    const moviessection = `
    <h2 class="movie-heading">${categoryName}<span class="explore">&nbsp;&nbsp;Explore ALL</span></h2>
    <div class="movie-row">
    ${movieslistHTML}
    </div>
    `
    // console.log(moviessection);

    const div = document.createElement('div');
    div.className = "movie-section"
    div.innerHTML = moviessection;

    //append HTML into movies Container
    moviesCOnt.append(div);
}

function searchmovietrailer(movieName) {
    if (movieName == "undefined") return;
    fetch(apipath.searchtrailer(movieName))
        .then(res => res.json())
        .then(res => {
            // console.log(res.items[0])
            const bestresult = res.items[0];
            const youtubeurl = `https://www.youtube.com/watch?v=${bestresult.id.videoId}`
            console.log(youtubeurl);
            window.open(youtubeurl, '_blank');

        })
        .catch(err => console.error(err));
}
window.addEventListener('load', function () {
    init();
    this.window.addEventListener('scroll', function () {
        const header = document.getElementById('header')
        if (window.scrollY > 5) {
            header.classList.add('black-bg')
        } else {
            header.classList.remove('black-bg')
        }
    })
})





// AIzaSyDbjoJe6KFhrIlnoe1j76wRq33Sy0PB6AM