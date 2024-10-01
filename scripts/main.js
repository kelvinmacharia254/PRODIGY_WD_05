// GUI elements
//  Display elements
const iconElement = document.querySelector('.weather-icon');
const locationIcon = document.querySelector('.location-icon');
const actualTempElement = document.querySelector('#actual_temp');
const feelsTempElement = document.querySelector('#feels_temp');
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
    console.log("getting location...")
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
        console.log("api call location latitude & longitude...")
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    }else if(location === "city"){
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    }

    try{
        console.log("call fetch api with a url...")
        const response = await fetch(apiUrl)
    // Check for HTTP errors like 404, 401, etc.
    if (!response.ok) {
        if (response.status === 404) {
             throw new Error(`Location couldn't be found[${response.status}]`)
        } else if (response.status === 401) {
            throw new Error(`Invalid API KEY[${response.status}]`)
        } else{
            throw new Error("Server errors")
        }
    }
    console.log("No error from fetch API...")
    const weatherInfo = await response.json();

    return weatherInfo;
    }catch(error){
        console.log("Fetch threw a error...")
        // handle generic network-related errors like "Failed to fetch"
        if(error.message === "Failed to fetch"){
            throw new Error("Failed to fetch weather info!! Check your Internet connection")
        }
        throw new Error(`Failed to fetch weather info!! ${error.message} `)
    }
}


async function getWeatherData (location) {
    try {
        const weatherData = await callWeatherAPI(location);
        console.log(weatherData); // Log the weather information
        weather.temparature.value = Math.floor(weatherData.main.temp - KELVIN)
        weather.temparature.feels = Math.floor(weatherData.main.feels_like - KELVIN)
        weather.description = weatherData.weather[0].description
        weather.iconId = weatherData.weather[0].icon
        weather.city = weatherData.name
        weather.country = weatherData.sys.country
        notificationElement.style.display = 'none';
        weatherDisplay()
        console.log(`weather = ${weather}`)
    } catch (error) {
        resetWeatherDisplay()
        console.log("Received fetch error")
        console.error(error.message); // Log any errors
        notificationElement.style.display = 'block';
        notificationElement.innerHTML = error.message;
    }
};


function weatherDisplay(){
    searchInput.value = weather.city
    iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.iconId}@2x.png">`
    actualTempElement.innerHTML = `${weather.temparature.value}<sup>&deg;</sup><span>C</span>&nbsp;&nbsp;|&nbsp;&nbsp;`
    feelsTempElement.innerHTML = `<span>Feels like</span> ${weather.temparature.feels}<sup>&deg;</sup><span>C</span>`
    descElement.innerHTML = weather.description
    locationElement.innerHTML = `${weather.city}, ${weather.country}\n [${latitude}, ${longitude}]`
}

function resetWeatherDisplay(){
    searchInput.value = ""
    iconElement.innerHTML = ""
    actualTempElement.innerHTML = ""
    feelsTempElement.innerHTML = ""
    descElement.innerHTML = ""
    locationElement.innerHTML = ""
}


searchInput.addEventListener('keyup', event => {
    if (event.keyCode === 13){
        event.preventDefault()

        city=searchInput.value;
        getWeatherData("city");
    }
});


locationIcon.addEventListener("click", event => {
    getWeatherData("coords");
})