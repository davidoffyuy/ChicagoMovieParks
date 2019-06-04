const getSunset = (lat, long, date, callback) => {
  const getSunriseSunsetAPI = 'https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + long + '&date=' + date + '&formatted=0';
  fetch(getSunriseSunsetAPI, {
    method: 'GET'
  })
  .then(response => {
    console.log(response);
    return response.json();
  })
  .then( setData => {
    callback(setData);
  });
}
