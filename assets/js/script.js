var currentDayWeather = document.querySelector("#current-date-weather");
var weekForecast = document.querySelector("#week-farecast");

var getCityWeather = function() {
    // hard coded for cary nc longitude and latititude
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={35.7915}&lon={78.7811}&exclude={part}";
    // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    console.log(apiUrl);
};
getCityWeather();