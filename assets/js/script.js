$(document).ready(function() {
  var searchHistory = {};

  $("#search-btn").on("click", getWeather);

  function getWeather() {
    $("#weather-view").empty();
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
        if (uvIndex <= 2.99) {
          background = "bg-success";
        } else if (uvIndex >= 3 && uvIndex <= 7.99) {
          background = "bg-warning";
        } else if (uvIndex >= 8) {
          background = "bg-danger";
        }
        $("#weather-view").append(
          `<p>UV Index: <span class="rounded p-1 ${background}">${uvIndex}</span></p>`
        );
      });
    });
    getForecast(city);
  }

  function getForecast(city) {
    $(".card-group").empty();
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=89361e8467bec0f20018786eac13a299";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(res) {
      console.log(res);
      var day = 1;
      for (i = 6; i < 39; i += 8) {
        console.log(res.list[i]);
        var date = moment()
          .add(day, "days")
          .format("l");
        var temp = Math.floor((res.list[i].main.temp - 273.15) * 1.8 + 32); // Kelvin to Fahrenheit
        var humidity = res.list[i].main.humidity;
        var block = `<div class="card m-2 bg-primary rounded text-light">
                        <div class="card-header">${date}</div>
                        <div class="card-body">
                            <i id="day1-icon" class="mb-1 fas fa-3x fa-sun"></i>
                            <p>Temperature: ${temp}&#176;F</p>
                            <p>Humidity: ${humidity}%</p>
                        </div>
                    </div>`;
        $(".card-group").append(block);
        day++;
      }
    });
  }

  function getSearchHistory() {}

  function storeSearchHistory() {}

  function renderSearchHistory() {}

  function renderWeather() {}

  function renderForecast() {}
});
