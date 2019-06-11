// Create movieData object. This object is global so it can be accessed by other functions.
let myMovieData = "";
let myMovies = [];
let queryDistance = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("find-button").addEventListener("click", event => {
    getMovieData(queryDistance, queryDistance + 1);
  });
});

const getMovieData = (minDist, maxDist) => {

  //show loader and hide button
  document.getElementById("global-loader").classList.remove("d-none");
  document.getElementById('find-button').classList.add('invisible');
  
  // Get location of myself
  navigator.geolocation.getCurrentPosition(position => {
    const myLat = position.coords.latitude;
    const myLong = position.coords.longitude;
    // const myLat = 40;
    // const myLong = -87;

    // Fetch movies and print on screen.
    myMovieData = new movieData();
    myMovieData.fetchData(() => {
      myMovies = myMovieData.getMoviesNearByPark(myLat, myLong, minDist, maxDist);

      // Hide loader and show button again
      document.getElementById("global-loader").classList.add("d-none");

      if (!jQuery.isEmptyObject(myMovies)) {
        generateParks(myMovies);
      }
      else {
        displayMessage("No Parks Found Near You");
      }
    });
  });
};

const displayMessage = message  => {
  const movieContainer = document.getElementById("park-list_row");
  const messageDiv = document.createElement('div');

  messageDiv.classList.add("text-center", "mx-auto", "py-3");
  messageDiv.innerHTML = message;
  movieContainer.appendChild(messageDiv);
}

const generateParks = (parkArr) => {
  const movieContainer = document.getElementById("park-list_row");
  for (let i = 0; i < parkArr.length; i++) {
    const parkKey = parkArr[i].key;
    const park = parkArr[i];
    const parkDiv = document.createElement("div");
    parkDiv.classList.add(
      "col-12",
      "col-sm-12",
      "col-md-12",
      "col-lg-12",
      "col-xl-12",
      "py-3",
      "park-container-transition"
    );
    parkDiv.id = parkKey + "-container";
    parkDiv.innerHTML = `
      <div id="${parkKey}-card" class="card mx-auto w-auto">
        <div id="${parkKey}-card_body" class="card-body">
          <h4 class="card-title">${park.movies[0].park}: ${park.movies[0].park_address} (${park.distance.toFixed(
      2
    )} miles) </h4>
            <div id="${parkKey}_card-movies" class="container row">
            <!--- Movie Content Goes Here -->
            </div>
            <div class="text-center"><a href="http://maps.google.com/maps?z=12&t=m&q=loc:${park.movies[0].location.coordinates[1]}+${
      park.movies[0].location.coordinates[0]
    }" class="btn btn-success btn-block">Show Location on Google Maps</a><div>
        </div>
      </div>
    `;
    movieContainer.appendChild(parkDiv);
    displayMovies(i, parkKey);
  }
  
  //Set button and queryDistance for next search
  const findButton = document.getElementById('find-button')
  queryDistance += 1;
  findButton.innerHTML = "Search Further!";
  findButton.classList.remove('invisible');
};

const displayMovies = (index, parkKey) => {
  const parkMoviesDiv = document.getElementById(parkKey + "_card-movies");
  parkMoviesDiv.innerHTML = "";
  const parkLength = myMovies[index].movies.length;
  let parkCounter = 0;

  for (let movie of myMovies[index].movies) {
    const movieDiv = document.createElement("div");
    const movieDate = moment(movie.date);
    const lat = movie.location.coordinates[1];
    const long = movie.location.coordinates[0];

    getSunset(lat, long, movieDate.format("YYYY-MM-DD"), sunsetData => {
      const sunsetTime = moment(sunsetData.results.sunset);
      movieDiv.classList.add("col-12", "col-sm-6", "col-md-6", "col-lg-4", "col-xl-4", "py-3");
      movieDiv.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <div>${movieDate.format("dddd, MMMM Do YYYY")}</div>
            <div>Sunset Time - ${sunsetTime.format("h:mm a")}</div>
            <div>Rating: ${movie.rating}</div>
          </div>
        </div>
      `;
      parkMoviesDiv.appendChild(movieDiv);

      parkCounter++;
      if (parkCounter === parkLength) {
        const parkContainerDiv = document.getElementById(parkKey + "-container");
        parkContainerDiv.classList.add('show');
      }
    });
  }
};
