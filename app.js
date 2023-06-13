const GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_KEY = "63b4fdaa546262ddc31445c20dc351b7";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

// Stores the values of the input given by the user
var inputValues = [];

document.addEventListener("DOMContentLoaded", function () {
  var submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", getValues);

  var pinButtonContainer = document.getElementById("pinButtonContainer");
  pinButtonContainer.style.display = "none"; // Hides the pin button container

  function getValues() {
    let countryInput = document.getElementById("countryInput").value;
    let stateInput = document.getElementById("stateInput").value;
    let cityInput = document.getElementById("cityInput").value;

    pinButtonContainer.style.display = "block"; // Shows the pin button container after getValues is preformed

    // Store the values in the inputValues array
    inputValues = [countryInput, stateInput, cityInput];

    processValues();

    fetchLocationAndWeatherData();
  }

  var pinButton = document.getElementById("pinButton");
  pinButton.addEventListener("click", createWeatherCard);

  function createWeatherCard() {
    // Create a new card element
    var card = document.createElement("div");
    card.classList.add("card");

    // Create elements for weather information
    var cityDisplay = document.createElement("h2");
    var temp = document.createElement("div");
    var icon = document.createElement("img");
    var description = document.createElement("div");
    var humidity = document.createElement("div");
    var wind = document.createElement("div");

    // Set the content of weather information
    cityDisplay.textContent =
      document.getElementById("cityDisplay").textContent;
    temp.textContent = document.getElementById("temp").textContent;
    icon.src = document.getElementById("icon").src;
    description.textContent =
      document.getElementById("description").textContent;
    humidity.textContent = document.getElementById("humidity").textContent;
    wind.textContent = document.getElementById("wind").textContent;

    // Appends weather information elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(temp);
    card.appendChild(icon);
    card.appendChild(description);
    card.appendChild(humidity);
    card.appendChild(wind);

    // Appends the card to the card container
    var cardContainer = document.getElementById("cardContainer");
    cardContainer.appendChild(card);
  }
});

// Used to capitalize the first letter of the description variable
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayWeatherInformation(weatherData) {
  const cityDisplay = document.getElementById("cityDisplay");
  const temp = document.getElementById("temp");
  const icon = document.getElementById("icon");
  const description = document.getElementById("description");
  const humidity = document.getElementById("humidity");
  const wind = document.getElementById("wind");

  cityDisplay.textContent = weatherData.name;
  temp.textContent = weatherData.main.temp + "°F";
  icon.src =
    "https://openweathermap.org/img/wn/" +
    weatherData.weather[0].icon +
    "@2x.png"; //Gets the display icon
  description.textContent = weatherData.weather[0].description;
  humidity.textContent = "Humidity: " + weatherData.main.humidity + "%";
  wind.textContent = "Wind speed: " + weatherData.wind.speed + " mph";

  const capitalizedDescription = capitalizeFirstLetter(
    weatherData.weather[0].description
  );
  description.textContent = capitalizedDescription;

  // Unhides the weatherInformation element
  const weatherInformation = document.getElementById("weatherInformation");
  weatherInformation.style.visibility = "visible";
}

function processValues() {
  console.log("Using input values outside the event listener scope:");
  console.log("Input 1: " + inputValues[0]);
  console.log("Input 2: " + inputValues[1]);
  console.log("Input 3: " + inputValues[2]);
}

function fetchLocationAndWeatherData() {
  // Stores the longitude and latitude
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
        // Stores the longitude and latitude and pushes it into the locationData array
        locationData.push({ lat, lon });
      });

      fetch(
        `${WEATHER_URL}?lat=${locationData[0].lat}&lon=${locationData[0].lon}&appid=${WEATHER_KEY}&units=imperial`
      )
        .then((response) => {
          return response.json();
        })
        .then((weather) => {
          console.log(weather);
          displayWeatherInformation(weather);
        })
        .catch((err) => console.error(err));

      console.log(locationData);
    });
}
