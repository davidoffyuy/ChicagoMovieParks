class movieData {
  constructor() {
    this.data = null;
  }

  fetchData(callback) {
    const self = this;
    // VANILLA JS
    fetch('https://data.cityofchicago.org/resource/muku-wupu.json', {
      method: 'GET',
      headers: {
        'X-App-Token': 'jLgIwxnaA3GpgLZy9Xswo9rXa',
      }
    }).then(response => {
      console.log(response);
      return response.json();
    })
    .then( movieData => {
      self.data = movieData;
      callback();
    });
    
    // JQUERY
  //   $.ajax({
  //     url: "https://data.cityofchicago.org/resource/muku-wupu.json",
  //     type: "GET",
  //     data: {
  //       "$limit" : 5000,
  //       "$$app_token" : "jLgIwxnaA3GpgLZy9Xswo9rXa"
  //     }
  // }).done(function(data) {
  //   alert("Retrieved " + data.length + " records from the dataset!");
  //   console.log(data);
  // });
  }

  // Returns an array with all movies showing in parks near me
  getMoviesNear(lat, long, dist) {
    // get movies for parks near me
    return this.data.filter(movie => {
      if (movie.location) {
        const milesBetween = calcLatLongDist(lat, long, movie.location.coordinates[1], movie.location.coordinates[0]);
        return milesBetween <= dist;
      }
      else {
        return false;
      }
    })
  }

  getMoviesNearByPark(lat, long, dist) {
    const self = this;
    const moviesNear = self.getMoviesNear(lat, long, dist);
    const moviesNearByPark = {};
    console.log(moviesNear);
    for (let movie of moviesNear) {
      // Check if park exists already. If it does, add to array 
      if (movie.park in moviesNearByPark) {
        moviesNearByPark[movie.park].movies.push({...movie});
      }
      else {
        moviesNearByPark[movie.park] = {
          movies: [{...movie}],
          distance: calcLatLongDist(lat, long, movie.location.coordinates[1], movie.location.coordinates[0])};
      }
    }
    return moviesNearByPark;
  }
}

//calculate the distance between two points using latitude and longitude
const calcLatLongDist = (lat1, lon1, lat2, lon2, unit) => {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
  }
}