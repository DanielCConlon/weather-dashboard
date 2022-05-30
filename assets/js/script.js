var currentWeatherContainer = document.querySelector("#current-day-container")
var currentDayWeatherEl = document.querySelector("#current-date-weather");
var weekForecastEl = document.querySelector("#week-forecast");
var forecastTitle = document.querySelector("#forecast");
var previousCitySearch = document.querySelector("#past-searches");

// form input for the city
var cityInputEl = document.querySelector("#cityName");
var cityFormEl = document.querySelector("#city-search-form");
var searchedCityEl = document.querySelector("#searched-city");

// empty array to hold cities searched for
var cities = []


var apiKey = "9e906a9a12e5dcce79a9f9095d702e4f";

var formSubmitHandler = function(event) {
    event.preventDefault();
    var  activeCity = cityInputEl.value.trim();
    if (activeCity) {
        // call functions
        getCityWeather(activeCity);
        get5Day(activeCity);
        cities.unshift({activeCity});
        searchedCityEl.textContent = "";
    }
    else {
        alert("Please enter a City!");
    }
    saveInput();
    previousSearch(activeCity);
};

var saveInput = function() {
    localStorage.getItem("cities", JSON.stringify(cities));
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
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

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

    for (var i = 5; i <= weather.list.length; i=i+8) {
        var dailyForecast = weather.list[i];

        var forecastCardEl = document.createElement("div");
        forecastCardEl.classList = "card m-2 bg-primary text-light";

        //create date element
        var currentCityDate = weather.list[i].dt;
        currentCityDate = moment.unix(currentCityDate).format("MM/DD/YYYY");
        var currentCityDateEl = document.createElement("span")
        currentCityDateEl.classList = "card-header text-center";
        currentCityDateEl.textContent = currentCityDate;
        forecastCardEl.append(currentCityDateEl)

        // create icon element
        var currentWeatherIcon = weather.list[i].weather[0].icon
        var currentWeatherIconEl = document.createElement("img");
        currentWeatherIconEl.classList = "card-header text-center";
        currentWeatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon + ".png");
        forecastCardEl.append(currentWeatherIconEl);


        // create a span element to hold temp data
        var temperatureEl = document.createElement("span");
        temperatureEl.classList = "card-header text-center";
        temperatureEl.textContent = "Temperature: " + weather.list[i].main.temp + " °F";
        temperatureEl.classList = "list-group-item";
        // append to the container
        forecastCardEl.appendChild(temperatureEl);

        //create a span element to hold Wind data
        var windSpeedEl = document.createElement("span");
        windSpeedEl.classList = "card-header text-center";
        windSpeedEl.textContent = "Wind Speed: " + weather.list[i].wind.speed + " MPH";
        windSpeedEl.classList = "list-group-item";
        // append to the container
        forecastCardEl.appendChild(windSpeedEl);

        //create a span element to hold Humidity data
        var humidityEl = document.createElement("span");
        humidityEl.classList = "card-header text-center";
        humidityEl.textContent = "Humidity: " + weather.list[i].main.humidity + " %";
        humidityEl.classList = "list-group-item";
        // append to the container
        forecastCardEl.appendChild(humidityEl);

        weekForecastEl.appendChild(forecastCardEl);
    }

};

var previousSearch = function(pastSearch) {
    previousCity = document.createElement("button");
    previousCity.classList = "d-flex w-100 btn-light border p-2";
    previousCity.setAttribute("data-city", pastSearch);
    previousCity.setAttribute("type", "submit");
    previousCity.textContent = pastSearch;

    previousCitySearch.appendChild(previousCity);
};

var previousSearchHandler = function(event) {
    var city = event.target.getAttribute("data-city");
    if(city) {
        getCityWeather(city);
        get5Day(city);
    }
};



cityFormEl.addEventListener("submit", formSubmitHandler);
previousCitySearch.addEventListener("click", previousSearchHandler);