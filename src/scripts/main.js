document.addEventListener("DOMContentLoaded", () => {
  console.log('hello');
  document.getElementById('getMovieButton').addEventListener("click", (event) => {
    // Get location of myself
    navigator.geolocation.getCurrentPosition(position => {
      const myLat = position.coords.latitude;
      const myLong = position.coords.longitude;

      // Create movieData object and fetch movies. Also print to screen
      let myMovieData = new movieData();
      myMovieData.fetchData(() => {
        // do stuff after data is fetched;
        const myMovies = myMovieData.getMoviesNearByPark(myLat, myLong, 1);
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
    parkDiv.classList.add("col-12", "col-sm-12", "col-md-6", "col-lg-6", "col-xl-4", "py-3");
    parkDiv.innerHTML = `
      <div class="card mx-auto" style="width: 20rem;">
        <div class="card-body">
          <h5 class="card-title">${parkData[park].movies[0].park}</h5>
            <p class="card-text">${parkData[park].movies[0].park_address}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    `;
    movieContainer.appendChild(parkDiv);
  }
}