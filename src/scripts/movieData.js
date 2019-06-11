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
  getMoviesNear(lat, long, minDist, maxDist) {

    // get movies for parks near me
    return this.data.filter(movie => {
      if (movie.location) {
        const milesBetween = calcLatLongDist(lat, long, movie.location.coordinates[1], movie.location.coordinates[0]);
        return (milesBetween >= minDist) && (milesBetween < maxDist);
      }
      else {
        return false;
      }
    })
  }

  // getMoviesNearByPark(lat, long, dist) {
  //   return new Promise((resolve, reject) => {
  //     const self = this;
  //     const moviesNear = self.getMoviesNear(lat, long, dist);
  //     const moviesNearByPark = {};
  //     console.log(moviesNear);
  
  //     const asyncTotalCount = moviesNear.length;
  //     let asyncCount = 0;
  
  //     for (let movie of moviesNear) {
  //       let parkKey = movie.park.replace(/[^A-Z0-9]/ig, '');
  //       // Check if park exists already. If it does, add to array. Else create new key

  //       const movieDate = moment(movie.date);
  //       const lat = movie.location.coordinates[1];
  //       const long = movie.location.coordinates[0];
  //       getSunset(lat, long, movieDate.format("YYYY-MM-DD"), (sunsetData) => {
  //         const sunsetTime = moment(sunsetData.results.sunset);
  
  //         if (parkKey in moviesNearByPark) {
  //           moviesNearByPark[parkKey].movies.push({sunsetTime: sunsetTime, ...movie});
  //         }
  //         else {
  //           moviesNearByPark[parkKey] = {
  //             movies: [{sunsetTime: sunsetTime, ...movie}],
  //             distance: calcLatLongDist(lat, long, movie.location.coordinates[1], movie.location.coordinates[0])};
  //         }
  //         asyncCount++;
  //         if (asyncCount === asyncTotalCount) {
  //           resolve(moviesNearByPark);
  //         }
  //       });
  //     }
  //   });
  // }

  getMoviesNearByPark(lat, long, minDist, maxDist) {
    const self = this;
    const moviesNear = self.getMoviesNear(lat, long, minDist, maxDist);
    const moviesNearByParkObj = {};

    for (let movie of moviesNear) {
      let parkKey = movie.park.replace(/[^A-Z0-9]/ig, '');

      // Check if park exists already. If it does, add to array. Else create new key
      if (parkKey in moviesNearByParkObj) {
        moviesNearByParkObj[parkKey].movies.push({...movie});
      }
      else {
        let parkDistance = calcLatLongDist(lat, long, movie.location.coordinates[1], movie.location.coordinates[0]);
        moviesNearByParkObj[parkKey] = {
          movies: [{...movie}],
          distance: parkDistance
        };
      }
    } 

    // Convert Object to Array for sorting purposes
    const moviesNearByParkArr = [];
    const parkKeys = Object.keys(moviesNearByParkObj);
    const parkValues = Object.values(moviesNearByParkObj);
    for (let i = 0; i < parkKeys.length; i++) {
      moviesNearByParkArr.push({...parkValues[i], key: parkKeys[i]});
    }

    // Sort park by distance
    moviesNearByParkArr.sort((first, second) => {
      if (first.distance < second.distance)
        return -1;
      else
        return 1;
    });

    return moviesNearByParkArr;
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