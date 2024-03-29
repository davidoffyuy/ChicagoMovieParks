// Create movieData object. This object is global so it can be accessed by other functions.
let myMovieData = ""; // Class to hold raw movie data
let myMovies = []; // Object formatted for best usage to display the parks and each movie
let myLat = '';
let myLong = '';

// Separate global Minimum and Maximum distance values used so initial search will be from 0-1 miles.
// After initial search, extended searches will search out in 0.5 mile increments.
let gMinDist = 0; 
let gMaxDist = 1;

let parksDisplayed = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("find-button").addEventListener("click", event => {
    getMovieData(gMinDist, gMaxDist);
  });
});

const getMovieData = (minDist, maxDist) => {

  //show loader and hide button
  document.getElementById("global-loader").classList.remove("d-none");
  document.getElementById('find-button').classList.add('invisible');
  
  // Get location of myself
  if (!myLat || !myLong) {
    navigator.geolocation.getCurrentPosition(position => {
      myLat = position.coords.latitude;
      myLong = position.coords.longitude;
      // myLat = 40;
      // myLong = -87;
  
      // Fetch movie data, if haven't done so. If movie data has been fetched, skip this step.
      // Print movies on screen.
      if (!myMovieData) {
        myMovieData = new movieData();
        myMovieData.fetchData(() => {
          myMovies = myMovieData.getMoviesNearByPark(myLat, myLong, minDist, maxDist);
    
          // Hide loader and show button again
          document.getElementById("global-loader").classList.add("d-none");
    
          if (!jQuery.isEmptyObject(myMovies)) {
            generateParks(myMovies);
          }
          else {
            displayMessage("No Parks Found!");
            resetFind();
          }
        });
      }
      else {
        myMovies = myMovieData.getMoviesNearByPark(myLat, myLong, minDist, maxDist);
  
        // Hide loader and show button again
        document.getElementById("global-loader").classList.add("d-none");
  
        if (!jQuery.isEmptyObject(myMovies)) {
          generateParks(myMovies);
        }
        else {
          displayMessage("No Parks Found!");
          resetFind();
        }
      }
    });    
  }
  else {
    // Fetch movie data, if haven't done so. If movie data has been fetched, skip this step.
    // Print movies on screen.
    if (!myMovieData) {
      myMovieData = new movieData();
      myMovieData.fetchData(() => {
        myMovies = myMovieData.getMoviesNearByPark(myLat, myLong, minDist, maxDist);
  
        // Hide loader and show button again
        document.getElementById("global-loader").classList.add("d-none");
  
        if (!jQuery.isEmptyObject(myMovies)) {
          generateParks(myMovies);
        }
        else {
          displayMessage("No Parks Found!");
          resetFind();
        }
      });
    }
    else {
      myMovies = myMovieData.getMoviesNearByPark(myLat, myLong, minDist, maxDist);

      // Hide loader and show button again
      document.getElementById("global-loader").classList.add("d-none");

      if (!jQuery.isEmptyObject(myMovies)) {
        generateParks(myMovies);
      }
      else {
        displayMessage("No Parks Found!");
        resetFind();
      }
    }
  }
};

const displayMessage = message  => {
  const messageContainer = document.getElementById("message_row");
  messageContainer.innerHTML = '';
  const messageDiv = document.createElement('div');

  messageDiv.classList.add("text-center", "mx-auto", "py-3", "h4");
  messageDiv.innerHTML = message;
  messageContainer.appendChild(messageDiv);
}

const generateParks = (parkArr) => {
  document.getElementById("message_row").innerHTML = '';
  const movieContainer = document.getElementById("park-list_row");
  for (let i = 0; i < parkArr.length; i++) {
    const parkKey = parkArr[i].key;
    const park = parkArr[i];

    // Generate google maps url
    const parkAddressArr = park.movies[0].park_address.split(' ');
    uriParkAddressArr = parkAddressArr.map(word => {
      return encodeURIComponent(word);
    })

    const parkNameArr = park.movies[0].park.split(' ');
    uriParkNameArr = parkNameArr.map(word => {
      return encodeURIComponent(word);
    })

    const parkNameURL = "https://www.google.com/maps/search/?api=1&query=" + uriParkNameArr.join('+') + uriParkAddressArr.join('+') + "+Chicago+IL";

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
            <div id="${parkKey}_card-movies" class="container row movie-row">
            <!--- Movie Content Goes Here -->
            </div>
            <div class="text-center"><a href="${parkNameURL}" target="_blank" class="btn btn-success" style="width: 50%; min-width: 300px;">Show Location on Google Maps</a><div>
        </div>
      </div>
    `;
    movieContainer.appendChild(parkDiv);
    displayMovies(i, parkKey);
  }
};

const displayMovies = (index, parkKey) => {
  const parkMoviesDiv = document.getElementById(parkKey + "_card-movies");
  parkMoviesDiv.innerHTML = "";
  const parkLength = myMovies[index].movies.length;
  let movieCounter = 0; //Used to keep track of # movies displayed for theater

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
            <div id="${parkKey + '-notice'}" ></div>
            <div>${movieDate.format("dddd, MMMM Do YYYY")}</div>
            <div>Sunset Time - ${sunsetTime.format("h:mm a")}</div>
            <div>Rating: ${movie.rating}</div>
          </div>
        </div>
      `;
      parkMoviesDiv.appendChild(movieDiv);

      // Determine if movie is past date or coming up soon
      let noticeDiv = document.getElementById(parkKey + '-notice');
      const sevenDaysAhead = moment().add(14, 'd');

      if (movieDate.isBefore(moment())) {
        noticeDiv.classList.add("expired-notice")
        noticeDiv.innerHTML = 'Expired';
      }
      else if (movieDate.isBefore(sevenDaysAhead)) {
        noticeDiv.classList.add("soon-notice")
        noticeDiv.innerHTML = 'Coming Up';
      }


      movieCounter++;
      
      // if all movies for the park have been displayed, display park
      if (movieCounter === parkLength) {
        const parkContainerDiv = document.getElementById(parkKey + "-container");
        parkContainerDiv.classList.add('force-show');
        parksDisplayed += 1;
        if (parksDisplayed === myMovies.length ) {
          resetFind();
        }
      }
    });
  }
};

const resetFind = () => {
    //Set button and queryDistance for next search
    const findButton = document.getElementById('find-button')
    gMinDist = gMaxDist;
    gMaxDist += 0.5;
    parksDisplayed = 0;
    findButton.innerHTML = "Search Further!";
    findButton.classList.remove('invisible');
}