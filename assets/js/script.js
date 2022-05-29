var currentDayWeatherEl = document.querySelector("#current-date-weather");
var weekForecastEl = document.querySelector("#week-farecast");
var weekHeader = document.querySelector("#week-header");
// form input for the city
var cityInputEl = document.querySelector("#cityName");
var cityFormEl = document.querySelector("#city-search-form");
var apiKey = "9e906a9a12e5dcce79a9f9095d702e4f";

var formSubmitHandler = function(event) {
    event.preventDefault();
    var  activeCity = cityInputEl.value.trim();
    if (activeCity) {
        // call functions
        getCityWeather(activeCity);
        getWeekForecast(activeCity);

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
    var currentCity = $("#cityName").val();
    // give the url for the city the user types in with parameters
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity) {
    // clear old information
    currentDayWeatherEl.textContent = "";
    cityInputEl.textContent = "";

    // create a date element
    var currentDate = document.createElement("span");
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ")";
    cityInputEl.appendChild(currentDate);

    // create an image element


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

var getWeekForecast = function(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayWeekWeather(data);
        });
    });
};

var displayWeekWeather = function(weather) {
    weekForecastEl.textContent = "";
    weekHeader.textContent = "Week Forecast";

    var upComingWeather = weather.list;
    for (var i = 5; i < upComingWeather.length; i=i+8) {
        var dailyForecast = upComingWeather[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";

        // create date element
        var forecastDate = document.createElement("h4");
        forecastDate.textContent = moment().unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center";
        forecastEl.appendChild(forecastDate);

        // create image icon

        // create a span element to hold temp data
        var forecastWeekTemp = document.createElement("span");
        forecastWeekTemp.textContent = "Temperature: " + weather.main.temp + " °F";
        forecastWeekTemp.classList = "list-group-item";
        // append to the container
        forecastEl.appendChild(forecastWeekTemp);


        //create a span element to hold Wind data
        var forecastWeekWind = document.createElement("span");
        forecastWeekWind.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
        forecastWeekWind.classList = "list-group-item";
        // append to the container
        forecastEl.appendChild(forecastWeekWind);

        //create a span element to hold Humidity data
        var forecastWeekHumidity = document.createElement("span");
        forecastWeekHumidity.textContent = "Humidity: " + weather.main.humidity + " %";
        forecastWeekHumidity.classList = "list-group-item";
        // append to the container
        forecastEl.appendChild(forecastWeekHumidity);

    }
};




cityFormEl.addEventListener("submit", formSubmitHandler);
