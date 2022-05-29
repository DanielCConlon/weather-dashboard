var currentWeatherContainer = document.querySelector("#current-day-container")
var currentDayWeatherEl = document.querySelector("#current-date-weather");
var weekForecastEl = document.querySelector("#week-forecast");
var forecastTitle = document.querySelector("#forecast");
// form input for the city
var cityInputEl = document.querySelector("#cityName");
var cityFormEl = document.querySelector("#city-search-form");
var searchedCityEl = document.querySelector("#searched-city");


var apiKey = "9e906a9a12e5dcce79a9f9095d702e4f";

var formSubmitHandler = function(event) {
    event.preventDefault();
    var  activeCity = cityInputEl.value.trim();
    if (activeCity) {
        // call functions
        getCityWeather(activeCity);
        get5Day(activeCity);
    }
    else {
        alert("Please enter a City!");
    }
    saveInput();
};

var saveInput = function() {
    // localStorage.getItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {

    // give the url for the city the user types in with parameters
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather) {
    // clear old information
    currentDayWeatherEl.textContent = "";

    var currentCity = $("#cityName").val();
    searchedCityEl.append(currentCity);


    //create date element
    var currentCityDate = weather.dt;
    currentCityDate = moment.unix(currentCityDate).format("MM/DD/YYYY");
    var currentCityDateEl = document.createElement("span")
    currentCityDateEl.textContent = currentCityDate;
    searchedCityEl.append(currentCityDateEl)

    // create icon element
    var currentWeatherIcon = weather.weather[0].icon
    var currentWeatherIconEl = document.createElement("img");
    currentWeatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon + ".png");
    searchedCityEl.append(currentWeatherIconEl);


    // create a span element to hold temp data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item";
    // append to the container
    currentDayWeatherEl.appendChild(temperatureEl);

    //create a span element to hold Wind data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item";
    // append to the container
    currentDayWeatherEl.appendChild(windSpeedEl);

    //create a span element to hold Humidity data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";
    // append to the container
    currentDayWeatherEl.appendChild(humidityEl);



    var latitude = weather.coord.lat;
    var longitude = weather.coord.lon;

    getUvIndex(latitude, longitude);

};

var getUvIndex = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL).then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
};

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    //append index to current weather
    currentDayWeatherEl.appendChild(uvIndexEl);
};

var get5Day = function(city) {
    // give the url for the city the user types in with parameters
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            display5Day(data);
        });
    });
};

var display5Day = function(weather) {
    weekForecastEl.textContent = "";
    forecastTitle.textContent = "Week Forecast";

    for (var i = 1; i <= weather.length; i++) {
        var dailyForecast = weather[i];

        var forecastCardEl = document.createElement("div");
        forecastCardEl.classList = "card m-2 bg-primary";

        //create date element
        var currentCityDate = weather.dt;
        currentCityDate = moment.unix(currentCityDate).format("MM/DD/YYYY");
        var currentCityDateEl = document.createElement("span")
        currentCityDateEl.textContent = currentCityDate;
        weekForecastEl.append(currentCityDateEl)

        // create icon element
        var currentWeatherIcon = weather.weather[0].icon
        var currentWeatherIconEl = document.createElement("img");
        currentWeatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon + ".png");
        weekForecastEl.append(currentWeatherIconEl);


        // create a span element to hold temp data
        var temperatureEl = document.createElement("span");
        temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
        temperatureEl.classList = "list-group-item";
        // append to the container
        weekForecastEl.appendChild(temperatureEl);

        //create a span element to hold Wind data
        var windSpeedEl = document.createElement("span");
        windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
        windSpeedEl.classList = "list-group-item";
        // append to the container
        weekForecastEl.appendChild(windSpeedEl);

        //create a span element to hold Humidity data
        var humidityEl = document.createElement("span");
        humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
        humidityEl.classList = "list-group-item";
        // append to the container
        weekForecastEl.appendChild(humidityEl);
    }

};



cityFormEl.addEventListener("submit", formSubmitHandler);