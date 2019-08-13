import {apiKey} from './secrets.js';
const infoSection = document.querySelector('#infoSection');
const loadingSection = document.querySelector('#loadingSection');

window.addEventListener('load', () => {
    let lat, long;
    const temperatureDescription = document.querySelector('.temperature-description');
    const temperatureDegree = document.querySelector('.temperature-degree');
    const locationTimezone = document.querySelector('.location-timezone');

    // Check if geolocation available before using
    if(navigator.geolocation){
        // Get current position of the browser
        navigator.geolocation.getCurrentPosition(position => {
            // Store latitutde and longitude values from Geolocation API
            lat = position.coords.latitude;
            long = position.coords.longitude;
            
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
                    const {temperature, summary} = data.currently;
                    temperatureDegree.textContent = temperature.toFixed(0);
                    temperatureDescription.textContent = summary;
                    // Get just the city name for location
                    const zone = data.timezone.split('/');
                    locationTimezone.textContent = zone[1];
                })
                .then(() => {
                    loadingSection.classList.add('hidden');
                    infoSection.classList.remove('hidden');
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }
    else{
        // TODO: Fix to display error message when location not available
        const errorStatement = document.querySelector('#loadCaption');
        errorStatement.textContent = "Sorry, your browser does not currently support geolocation";
    }
});