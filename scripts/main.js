// async function fetchWeatherInfo(){
//     const API_KEY = "237ec7ebf9e55cae7d76169e622669ea"
//     const {latitude, longitude} = await getLocation();
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
//
//     if (!response.ok) {
//         const error = new Error("Failed to fetch weather info");
//         throw error;
//     }
//
//     const weatherInfo = await response.json();
//     return weatherInfo;
// }
//
// (async () => {
//     try {
//         const weatherData = await fetchWeatherInfo();
//         console.log(weatherData); // Log the weather information
//     } catch (error) {
//         console.error(error.message); // Log any errors
//     }
// })();

// GUI elements
//  Display
const iconElement = document.querySelector('.weather-icon');
const locationIcon = document.querySelector('.location-icon');
const tempElement = document.querySelector('.temperature-value');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');

//  inputs
let input = document.querySelector('#search');


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
    getWeather(latitude, longitude)
}

function showError(error){
    console.log(`${error.message}`)
}


function getWeather(latitude, longitude) {
    let apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`

    fetch(apiUrl)
        .then(response=>{
            let data = response.json()
            console.log(`data => ${data}`)
            return data
        }).then(data=>{
            weather.temparature.value = Math.floor(data.main.temp - KELVIN)
            weather.description = data.weather[0].description
            weather.iconId = data.weather[0].icon
            weather.city = data.name
            weather.country = data.sys.country
            console.log(`weather = ${weather}`)
        }).then( () => {
        }).then( () => {
            displayweather()
        })
}


function getSearchWeather(city){
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

   fetch(api)
        .then(response=>{
            let data = response.json()
            console.log(`data => ${data}`)
            return data
        }).then(data=>{
            weather.temparature.value = Math.floor(data.main.temp - KELVIN)
            weather.description = data.weather[0].description
            weather.iconId = data.weather[0].icon
            weather.city = data.name
            weather.country = data.sys.country
            console.log(`weather = ${weather}`)
        }).then( () => {
        }).then( () => {
            displayweather()
        })
}

function displayweather(){

    iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.iconId}@2x.png">`
    // iconElement.innerHTML = `<img src="icons/${weather.iconId}.png">`
    tempElement.innerHTML = `${weather.temparature.value}*<span>C</span>`
    descElement.innerHTML = weather.description
    locationElement.innerHTML = `${weather.city}, ${weather.country}\n [${latitude}, ${longitude}]`
}



input.addEventListener('keyup', event => {
    if (event.keyCode ===13){
        event.preventDefault()

        city=input.value;
        getSearchWeather(city);
        console.log(city);
    }
});


locationIcon.addEventListener("click", event => {
    console.log("Hey")
    getWeather()
})