const GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/direct";
const WEATHER_KEY = "63b4fdaa546262ddc31445c20dc351b7";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

//Stores the values of the input given by the user
var inputValues = [];

document.addEventListener("DOMContentLoaded", function () {
  var submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", getValues);

  function getValues() {
    let countryInput = document.getElementById("countryInput").value;
    let stateInput = document.getElementById("stateInput").value;
    let cityInput = document.getElementById("cityInput").value;

    //Store the values in the inputValues array
    inputValues.push(countryInput, stateInput, cityInput);

    //Send the values or perform any other actions with them
    console.log("Input 1: " + inputValues[0]);
    console.log("Input 2: " + inputValues[1]);
    console.log("Input 3: " + inputValues[2]);

    processValues();

    fetchLocationAndWeatherData();
  }
});

function processValues() {
  console.log("Using input values outside the event listener scope:");
  console.log("Input 1: " + inputValues[0]);
  console.log("Input 2: " + inputValues[1]);
  console.log("Input 3: " + inputValues[2]);
}

function fetchLocationAndWeatherData() {
  //Stores the longitude and latitude
  let locationData = [];

  let geoPromise = fetch(
    `${GEOCODE_URL}?q=${inputValues[2]},${inputValues[1]},${inputValues[0]}&limit=7&appid=${WEATHER_KEY}`
  );

  geoPromise
    .then((response) => {
      return response.json();
    })
    .then((locations) => {
      locations.forEach((location) => {
        const { lat, lon } = location;
        //Store the longitude and latitude and pushes it into the locationData array
        locationData.push({ lat, lon });
      });

      let weatherPromise = fetch(
        `${WEATHER_URL}?lat=${locationData[0].lat}&lon=${locationData[0].lon}&appid=${WEATHER_KEY}&units=imperial`
      );

      weatherPromise
        .then((response) => {
          return response.json();
        })
        .then((weather) => {
          console.log(weather);
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));

  console.log(locationData);
}
