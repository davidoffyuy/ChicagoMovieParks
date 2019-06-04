// Create movieData object. This object is global so it can be accessed by other functions.
let myMovieData = "";
let myMovies = "";

document.addEventListener("DOMContentLoaded", () => {
  console.log('hello');
  const distanceButtons = document.getElementsByClassName('radius');
  console.log(distanceButtons);
  for (let distanceButton of distanceButtons) {
    let value = distanceButton.value;
    console.log(value);
    distanceButton.addEventListener("click", event => {
      document.getElementById('park-list_row').innerHTML = '';
      getMovieData(value);
    })
  }
})

const getMovieData = distance => {
  // Get location of myself
  navigator.geolocation.getCurrentPosition(position => {
    const myLat = position.coords.latitude;
    const myLong = position.coords.longitude;
    // const myLat = 41.847767;
    // const myLong = -87.623683;

    // Fetch movies and print on screen.
    myMovieData = new movieData();
    myMovieData.fetchData(() => {
      myMovieData.getMoviesNearByPark(myLat, myLong, distance)
      .then(data => {
        myMovies = data;
        generateParks(myMovies);
      });
    });
  }, error => {
    console.log(error);
  });
}

const generateParks = parkData => {
  const movieContainer = document.getElementById('park-list_row');
  for (let parkKey in parkData) {
    const park = parkData[parkKey];
    const parkDiv = document.createElement('div');
    parkDiv.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "py-3");
    parkDiv.innerHTML = `
      <div class="card mx-auto w-auto">
        <div id="${parkKey}-card_body" class="card-body">
          <h4 class="card-title">${park.movies[0].park}: ${park.movies[0].park_address} </h4>
            <div id="${parkKey}_card-movies" class="container row">
            </div>
            <a href="http://maps.google.com/maps?z=12&t=m&q=loc:${park.movies[0].location.coordinates[1]}+${park.movies[0].location.coordinates[0]}" class="btn btn-primary">Show Location</a>
        </div>
      </div>
    `;
    movieContainer.appendChild(parkDiv);
    displayMovies(parkKey);
  }
}

const displayMovies = parkName => {
  const parkMoviesDiv = document.getElementById(parkName + "_card-movies");
  parkMoviesDiv.innerHTML = '';

  for (let movie of myMovies[parkName].movies) {
    const movieDiv = document.createElement('div');
    const movieDate = moment(movie.date);

    // movieDiv.classList.add("col-12", "col-sm-6", "col-md-6", "col-lg-4", "col-xl-4", "py-3");
    movieDiv.classList.add( "col-12", "col-sm-6", "col-md-6", "col-lg-4", "col-xl-4", "py-3");
    movieDiv.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <div>${movieDate.format('dddd, MMMM Do YYYY')}</div>
          <div>Sunset Showing Time - ${movie.sunsetTime.format('h:mm:ss a')}</div>
          <div>Rating: ${movie.rating}</div>
        </div>
      </div>
    `;
    parkMoviesDiv.appendChild(movieDiv);
  }
}