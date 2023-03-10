//API link
//https://www.omdbapi.com/?i=tt3896198&apikey=bf9d768b
//https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
//https://omdbapi.com/?s=thor&page=1&apikey=bf9d768b

const movieSearchBox = document.getElementById("movie-search-box")
const searchList = document.getElementById("search-list")
const resultGrid = document.getElementById("result-grid")
let searchTerm

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=bf9d768b`
  const res = await fetch(`${URL}`)
  const data = await res.json()
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search)
}

//
function findMovies() {
  //searchTerm 要加 HIHTLIGHT
  searchTerm = movieSearchBox.value.trim()
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list")
    loadMovies(searchTerm)
  } else {
    searchList.classList.add("hide-search-list")
  }
}

//Highlight matched words
/* let input = (movieSearchBox.value).trim();

input.addEventListener("keyup", (e) => {
    for(let i of searchList){
        //convert input to lowercase and compare with each string
        if(i.toLowerCase().startWith(input.ariaValueMax.
           toLowerCase() ) && input.value !=""){

            let listItem = document.createElement("li");
            //One common class
            listItem.classList.add("list-items")
            listItem.style.cursor = "pointer";
            listItem.setAttribute("onclick" , "displayName('" +
           
           i + "' )");

           //Display matched part in bold
           let word ="<b>" +  i.substr(0,input.value.length) + "</b>";
           }
           word = i.substr(input.value.length)
    }

});

function displayName(value){
    input.value=value;
}
 */
function updateHaystack(input, needle) {
  return input.replace(
    new RegExp("(^|\\s)(" + needle + ")(\\s|$)", "ig"),
    "$1<span class='bold'>$2</span>$3"
  )
}

function displayMovieList(movies) {
  searchList.innerHTML = ""

  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div")
    movieListItem.dataset.id = movies[idx].imdbID // setting movie id in  data-id
    movieListItem.classList.add("search-list-item")
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster
    else moviePoster = "image_not_found.png"

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <p>${updateHaystack(movies[idx].Title, searchTerm)}</p>

            <p>${movies[idx].Year}</p>
        </div>
        `
    searchList.appendChild(movieListItem)
  }
  loadMovieDetails()
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item")
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list")
      movieSearchBox.value = ""
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`
      )
      const movieDetails = await result.json()
      // console.log(movieDetails);
      displayMovieDetails(movieDetails)
    })
  })
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
} 

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list")
  }
})
