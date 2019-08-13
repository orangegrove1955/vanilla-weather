import { apiKey } from "./key.js";

const infoSection = document.querySelector("#infoSection");
const loadingSection = document.querySelector("#loadingSection");

window.addEventListener("load", () => {
  let lat, long;
  const temperatureSection = document.querySelector(".degree-section");
  const degreeSpan = document.querySelector(".degree-section span");
  const temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  const temperatureDegree = document.querySelector(".temperature-degree");
  const locationTimezone = document.querySelector(".location-timezone");
  const weatherIcon = document.querySelector(".weather-icon");

  // Check if geolocation available before using
  if (navigator.geolocation) {
    // Get current position of the browser
    navigator.geolocation.getCurrentPosition(
      position => {
        // Store latitutde and longitude values from Geolocation API
        lat = position.coords.latitude;
        long = position.coords.longitude;
        getWeather(lat, long);
      },
      error => {
        alert(
          "Sorry, your position could not be found, defaulting to New York"
        );
        lat = 40.73061;
        long = -73.935242;
        getWeather(lat, long);
      },
      { timeout: 10000 }
    );
  } else {
    // TODO: Fix to display error message when location not available
    const errorStatement = document.querySelector("#loadCaption");
    errorStatement.textContent =
      "Sorry, your browser does not currently support geolocation";
  }

  function getWeather(lat, long) {
    // Need to use a proxy to allow CORS from localhost
    const proxy = "https://cors-anywhere.herokuapp.com/";
    // API call to Dark Sky API using secret key
    const api = `${proxy}https://api.darksky.net/forecast/${apiKey}/${lat},${long}`;
    fetch(api)
      .then(response => {
        // Format data into json
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Use data to populate page
        const { temperature, summary, icon } = data.currently;
        temperatureDegree.textContent = temperature.toFixed(0);
        temperatureDescription.textContent = summary;
        // Get just the city name for location
        const zone = data.timezone.split("/");
        locationTimezone.textContent = zone[1].replace(/_/g, " ");
        // Set icon for weather
        setIcons(icon, weatherIcon);

        // Add event listener to convert between C and F
        const celcius = (temperature - 32) * (5 / 9);
        temperatureSection.addEventListener("click", () => {
          if (degreeSpan.textContent === "℉") {
              degreeSpan.textContent = "℃";
              temperatureDegree.textContent = celcius.toFixed(0);
          } else {
            degreeSpan.textContent = "℉";
            temperatureDegree.textContent = temperature.toFixed(0);
          }
        });
      })
      .then(() => {
        loadingSection.classList.add("hidden");
        infoSection.classList.remove("hidden");
        infoSection.classList.add("flex");
      })
      .then()
      .catch(err => {
        alert(
          "There was a problem getting the current weather, please try reloading the page"
        );
      });
  }

  function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
