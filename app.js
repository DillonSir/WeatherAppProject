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

    pinButtonContainer.style.display = "block";

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

    // Set the input values as data attributes on the card
    card.dataset.country = document.getElementById("countryInput").value;
    card.dataset.state = document.getElementById("stateInput").value;
    card.dataset.city = document.getElementById("cityInput").value;

    // Create elements for the weather information
    var cityDisplay = document.createElement("h2");
    cityDisplay.id = "cityDisplay";
    var temp = document.createElement("div");
    temp.id = "temp";
    var icon = document.createElement("img");
    icon.id = "icon";
    var description = document.createElement("div");
    description.id = "description";
    var humidity = document.createElement("div");
    humidity.id = "humidity";
    var wind = document.createElement("div");
    wind.id = "wind";
    var deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "Remove";
    var dateTime = document.createElement("div");
    dateTime.id = "dateTime";
    var refreshButton = document.createElement("button");
    refreshButton.classList.add("refreshButton");
    refreshButton.textContent = "Refresh";

    // Set the content of the weather information
    cityDisplay.textContent =
      document.getElementById("cityDisplay").textContent;
    temp.textContent = document.getElementById("temp").textContent;
    icon.src = document.getElementById("icon").src;
    description.textContent =
      document.getElementById("description").textContent;
    humidity.textContent = document.getElementById("humidity").textContent;
    wind.textContent = document.getElementById("wind").textContent;

    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "Remove";

    refreshButton.classList.add("refreshButton");
    refreshButton.textContent = "Refresh";

    // Appends weather information elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(temp);
    card.appendChild(icon);
    card.appendChild(description);
    card.appendChild(humidity);
    card.appendChild(wind);
    card.appendChild(dateTime);
    card.appendChild(deleteButton);
    card.appendChild(refreshButton);

    // Appends the card to the card container
    var cardContainer = document.getElementById("selectedAreas");
    cardContainer.appendChild(card);

    // Displays the date and time
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTimeString = date + " " + time;
    dateTime.textContent = "Last update: " + dateTimeString;

    var deleteButtons = document.getElementsByClassName("deleteButton");
    for (var i = 0; i < deleteButtons.length; i++) {
      var deleteButton = deleteButtons[i];
      deleteButton.addEventListener("click", deleteCard);
    }

    // Updates the weather information on the card
    refreshButton.addEventListener("click", function () {
      var card = this.parentNode;
      var country = card.dataset.country;
      var state = card.dataset.state;
      var city = card.dataset.city;

      fetch(
        `${GEOCODE_URL}?q=${city},${state},${country}&limit=7&appid=${WEATHER_KEY}`
      )
        .then((response) => response.json())
        .then((locations) => {
          if (locations.length > 0) {
            const { lat, lon } = locations[0];
            return fetch(
              `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=imperial`
            );
          } else {
            throw new Error("Location not found");
          }
        })
        .then((response) => response.json())
        .then((weather) => {
          card.querySelector("#cityDisplay").textContent = weather.name;
          card.querySelector("#temp").textContent = weather.main.temp + "°F";
          card.querySelector("#icon").src =
            "https://openweathermap.org/img/wn/" +
            weather.weather[0].icon +
            "@2x.png";
          card.querySelector("#description").textContent =
            capitalizeFirstLetter(weather.weather[0].description);
          card.querySelector("#humidity").textContent =
            "Humidity: " + weather.main.humidity + "%";
          card.querySelector("#wind").textContent =
            "Wind speed: " + weather.wind.speed + " mph";

          var today = new Date();
          var date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          var time =
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          var dateTimeString = date + " " + time;
          card.querySelector("#dateTime").textContent =
            "Last update: " + dateTimeString;
        })
        .catch((error) => {
          console.error("Error refreshing weather information:", error);
        });
    });

    // Deletes the card you click the remove button on
    function deleteCard() {
      var card = this.parentNode;
      cardContainer.removeChild(card);
    }
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
