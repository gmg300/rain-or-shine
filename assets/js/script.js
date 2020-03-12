$(document).ready(function() {
  var history;
  var currentCity;

  var weatherIcons = {
    clear: "http://openweathermap.org/img/wn/01d@2x.png",
    clouds: "http://openweathermap.org/img/wn/02d@2x.png",
    drizzle: "http://openweathermap.org/img/wn/09d@2x.png",
    rain: "http://openweathermap.org/img/wn/10d@2x.png",
    thunderstorm: "http://openweathermap.org/img/wn/11d@2x.png",
    snow: "http://openweathermap.org/img/wn/13d@2x.png",
    mist: "http://openweathermap.org/img/wn/50d@2x.png"
  };

  $("#search-btn").on("click", function() {
    getWeather();
    setTimeout(function() {console.log(currentCity)}, 3000);

  });

  function getWeather() {
    $("#weather-view").empty();
    var city = $("#search-input")
      .val()
      .trim();
    // console.log(city);
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=89361e8467bec0f20018786eac13a299";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(res) {
      var cityDate = moment().format("l");
      currentCity = res.name;
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      var temp = Math.floor((res.main.temp - 273.15) * 1.8 + 32); // Kelvin to Fahrenheit
      var humidity = res.main.humidity;
      var wind = Math.floor(res.wind.speed * 2.237); // m/s to MPH
      var con = res.weather[0].main;
      var icon = "";
      if (con == "Clear") {
        icon = weatherIcons.clear;
      } else if (con == "Clouds") {
        icon = weatherIcons.clouds;
      } else if (con == "Drizzle") {
        icon = weatherIcons.drizzle;
      } else if (con == "Rain") {
        icon = weatherIcons.rain;
      } else if (con == "Thunderstorm") {
        icon = weatherIcons.thunderstorm;
      } else if (con == "Snow") {
        icon = weatherIcons.snow;
      } else {
        icon = weatherIcons.mist;
      }
      // console.log(res);
      $("#weather-view").append(
        `<h2 id="current-city" class="pb-3">${currentCity} (${cityDate})<img src="${icon}" /></h2>`
      );
      $("#weather-view").append(`<p>Temperature: ${temp} &#176;F</p>`);
      $("#weather-view").append(`<p>Humidity: ${humidity}%</p>`);
      $("#weather-view").append(`<p>Wind Speed: ${wind} MPH</p>`);
      getUV(lat, lon);
    });
    getForecast(city);
  }

  function getUV(lat, lon) {
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
  }

  function getForecast(city) {
    $(".card-group").empty();
    $("#forecast-title").empty();
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=89361e8467bec0f20018786eac13a299";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(res) {
      // console.log(res);
      $("#forecast-title").append("<h2>5-Day Forecast:</h2>");
      var day = 1;
      for (i = 6; i < 39; i += 8) {
        // console.log(res.list[i]);
        var date = moment()
          .add(day, "days")
          .format("l");
        var temp = Math.floor((res.list[i].main.temp - 273.15) * 1.8 + 32); // Kelvin to Fahrenheit
        var humidity = res.list[i].main.humidity;
        var con = res.list[i].weather[0].main;
        var icon = "";
        if (con == "Clear") {
          icon = weatherIcons.clear;
        } else if (con == "Clouds") {
          icon = weatherIcons.clouds;
        } else if (con == "Drizzle") {
          icon = weatherIcons.drizzle;
        } else if (con == "Rain") {
          icon = weatherIcons.rain;
        } else if (con == "Thunderstorm") {
          icon = weatherIcons.thunderstorm;
        } else if (con == "Snow") {
          icon = weatherIcons.snow;
        } else {
          icon = weatherIcons.mist;
        }
        var block = `<div class="col-sm col-md-6 col-lg-4">
                    <div class="card m-2 bg-primary rounded text-light">
                        <div class="card-header">${date}</div>
                        <div class="card-body">
                            <img src="${icon}" />
                            <p>Temperature: ${temp}&#176;F</p>
                            <p>Humidity: ${humidity}%</p>
                        </div>
                    </div>
                    </div>`;
        $(".card-group").append(block);
        day++;
      }
    });
  }

  function renderHistory(city) {

  }

});
