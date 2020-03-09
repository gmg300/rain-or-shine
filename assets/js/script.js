$(document).ready(function() {
  $("#search-btn").on("click", getWeather);
  function getWeather() {
    $("#weather-view").empty();
    // Current Weather
    var city = $("#search-input")
      .val()
      .trim();
    console.log(city);
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=89361e8467bec0f20018786eac13a299";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(res) {
      var cityDate = moment().format("l");
      var currentCity = res.name;
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      var temp = Math.floor((res.main.temp - 273.15) * 1.8 + 32); // Kelvin to Fahrenheit
      var humidity = res.main.humidity;
      var wind = Math.floor(res.wind.speed * 2.237); // m/s to MPH
      console.log(res);
      $("#weather-view").append(
        `<h2 id="current-city" class="pb-3">${currentCity} (${cityDate}) <i id="weatherIcon" class="fas fa-cloud"></i></h2>`
      );
      $("#weather-view").append(`<p>Temperature: ${temp} &#176;F</p>`);
      $("#weather-view").append(`<p>Humidity: ${humidity}%</p>`);
      $("#weather-view").append(`<p>Wind Speed: ${wind} MPH</p>`);
      $.ajax({
        url:
          "http://api.openweathermap.org/data/2.5/uvi?appid=89361e8467bec0f20018786eac13a299&lat=" +
          lat +
          "&lon=" +
          lon,
        method: "GET"
      }).then(function(res) {
          var uvIndex = res.value;
          var background = "bg-secondary";
          if(uvIndex <= 2.99) {
              background = "bg-success";
          } else if(uvIndex >= 3 && uvIndex <= 7.99) {
              background = "bg-warning";
          } else if(uvIndex >= 8) {
              background = "bg-danger";
          }
          $("#weather-view").append(`<p>UV Index: <span class="rounded p-1 ${background}">${uvIndex}</span></p>`);
      });
    });
  }

  var searchHistory = {};

  function getSearchHistory() {}

  function storeSearchHistory() {}

  function renderSearchHistory() {}

  function renderWeather() {}

  function getForecast() {}

  function renderForecast() {}

  var forecastDates = moment()
    .add(1, "days")
    .format("l");
});
