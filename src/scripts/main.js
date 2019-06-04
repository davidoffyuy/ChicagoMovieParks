// Create movieData object. This object is global so it can be accessed by other functions.
let myMovieData = "";
let myMovies = "";

document.addEventListener("DOMContentLoaded", () => {
  console.log('hello');
  document.getElementById('getMovieButton').addEventListener("click", (event) => {
    // Get location of myself
    navigator.geolocation.getCurrentPosition(position => {
      const myLat = position.coords.latitude;
      const myLong = position.coords.longitude;
      // const myLat = 41.847767;
      // const myLong = -87.623683;

      // Fetch movies and print on screen.
      myMovieData = new movieData();
      myMovieData.fetchData(() => {
        myMovies = myMovieData.getMoviesNearByPark(myLat, myLong, 2);
        console.log(myMovies);
        generateParks(myMovies);
        // for (let movie of myMovieData.data) {
        //   const ul = document.getElementById('movie-list_container');
        //   const li = document.createElement('li');
        //   li.appendChild(document.createTextNode(movie.title));
        //   ul.appendChild(li);
      });
    }, error => {
      console.log(error);
    });
  });
})

const generateParks = parkData => {
  const movieContainer = document.getElementById('park-list_row');
  for (let park in parkData) {
    const parkDiv = document.createElement('div');
    parkDiv.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "py-3");
    parkDiv.innerHTML = `
      <div class="card mx-auto w-auto">
        <div id="${park}-card_body" class="card-body">
          <h4 class="card-title">${parkData[park].movies[0].park}: </h4>
            <p class="card-text">${parkData[park].movies[0].park_address}</p>
            <div id="${park}_card-movies" class="container row">
            </div>
            <a href="http://maps.google.com/maps?z=12&t=m&q=loc:${parkData[park].movies[0].location.coordinates[1]}+${parkData[park].movies[0].location.coordinates[0]}" class="btn btn-primary">Show Location</a>
        </div>
      </div>
    `;
    movieContainer.appendChild(parkDiv);
    displayMovies(park);
  }
}

const displayMovies = parkName => {
  const parkMoviesDiv = document.getElementById(parkName + "_card-movies");
  parkMoviesDiv.innerHTML = '';
  for (let movie of myMovies[parkName].movies) {
    const movieDiv = document.createElement('div');
    // movieDiv.classList.add("col-12", "col-sm-6", "col-md-6", "col-lg-4", "col-xl-4", "py-3");
    movieDiv.classList.add( "col-12", "col-sm-6", "col-md-6", "col-lg-4", "col-xl-4", "py-3");
    movieDiv.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${movie.title}: </h5>
          <div>Date: ${movie.date}</div>
          <div>Rating: ${movie.rating}</div>
        </div>
      </div>
    `;
    parkMoviesDiv.appendChild(movieDiv);
  }

  console.log(parkName);
  console.log(myMovies[parkName].movies[0].park);
}