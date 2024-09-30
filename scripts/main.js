// GUI elements
//  Display elements
const iconElement = document.querySelector('.weather-icon');
const locationIcon = document.querySelector('.location-icon');
const tempElement = document.querySelector('.temperature-value');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');

//  inputs elements
let searchInput = document.querySelector('#search');

// Global variables
let city;
let latitude = 0.0;
let longitude = 0.0;

const weather ={}

weather.temparature ={
    unit:"celsius"
}
const KELVIN = 273

const apiKey = '237ec7ebf9e55cae7d76169e622669ea'  // https://home.openweathermap.org/api_keys


// fetch current location
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError)

} else{
    notificationElement.style.display = 'block'
    notificationElement.innerHTML = '<p>Browser doesnt support geolocation</p>'
}

function setPosition(position){
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    console.log(latitude, longitude)
    // get weather of current location on loading
    getWeatherData("coords")
}

function showError(error){
    console.log(`${error.message}`)
}


async function callWeatherAPI(location){
    let apiUrl
    if(location === "coords"){
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    }else if(location === "city"){
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    }

    const response = await fetch(apiUrl)

    if (!response.ok) {
        const error = new Error("Failed to fetch weather info");
        throw error;
    }

    const weatherInfo = await response.json();
    return weatherInfo;
}


async function getWeatherData (location) {
    try {
        const weatherData = await callWeatherAPI(location);
        console.log(weatherData); // Log the weather information
        weather.temparature.value = Math.floor(weatherData.main.temp - KELVIN)
        weather.description = weatherData.weather[0].description
        weather.iconId = weatherData.weather[0].icon
        weather.city = weatherData.name
        weather.country = weatherData.sys.country
        displayweather()
        console.log(`weather = ${weather}`)
    } catch (error) {
        console.error(error.message); // Log any errors
    }
};


function displayweather(){
    searchInput.value = weather.city
    iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.iconId}@2x.png">`
    // iconElement.innerHTML = `<img src="icons/${weather.iconId}.png">`
    tempElement.innerHTML = `${weather.temparature.value}<sup>o</sup><span>C</span>`
    descElement.innerHTML = weather.description
    locationElement.innerHTML = `${weather.city}, ${weather.country}\n [${latitude}, ${longitude}]`
}

searchInput.addEventListener('keyup', event => {
    if (event.keyCode ===13){
        event.preventDefault()

        city=searchInput.value;
        getWeatherData("city");
    }
});


locationIcon.addEventListener("click", event => {
    getWeatherData("coords");
})