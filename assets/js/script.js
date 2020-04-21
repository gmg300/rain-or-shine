$(document).ready(function() {
  var history = [];
  
  getHistory();

  // SEARCH WEATHER BY CITY
  $("#search-btn").on("click", function(e) {
    e.preventDefault();
    getWeather();
  });
  // DISPLAY WEATHER FROM CITY IN SEARCH HISTORY
  $(document).on("click", ".search-again", function() {
    $(".search-again").removeClass("active"); // Reset and set active status on list group item
    $(this).addClass("active");
    var search = $(this).text(); // Use text from list group item to query weather api
    $("#search-input").val(search);
    getWeather();
  });

  function getWeather() { // Partial structure credit - Trilogy 06-Server-Side-APIs activities
    var city = $("#search-input") // Get user search input
      .val()
      .trim();
    if(city == '') {
      return;
    }
    $("#weather-view").empty(); // Clear page of rendered data
    $(".card-deck").empty();
    $("#forecast-title").empty(); 
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=89361e8467bec0f20018786eac13a299";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(res) {
      // console.log('Current Weather');
      // console.log(res);
      var currentCity = res.name; // Set city name for query globally
      addCity(currentCity);
      var lat = res.coord.lat;
      var lon = res.coord.lon;
      renderWeather(res, currentCity);
      getUV(lat, lon);
    })
    .catch(() => {
      var block = `<h1 class="text-center text-danger my-5">I couldn't find weather for that city :(</h1>`; 
      $('#weather-view').append(block);
    });
    getForecast(city);
    $("#search-input").val(""); // Clear search input box 
  }

  function renderWeather(res, currentCity) { // Partial structure credit - Trilogy 06-Server-Side-APIs activities
    var cityDate = moment().format("l");
    var temp = Math.floor((res.main.temp - 273.15) * 1.8 + 32); // Kelvin to Fahrenheit
    var humidity = res.main.humidity;
    var wind = Math.floor(res.wind.speed * 2.237); // m/s to MPH
    var con = res.weather[0].main; // Weather conditions
    var icon = getIcon(con);
    var block = `<h2 id="current-city" class="pb-3">${currentCity} (${cityDate})<img src="${icon}" /></h2>
                  <p>Temperature: ${temp} &#176;F</p>
                  <p>Humidity: ${humidity}%</p>
                  <p>Wind Speed: ${wind} MPH</p>`;
    $("#weather-view").append(block);
  }

  function getIcon(con) {
    var weatherIcons = { // Open Weather API common weather conditions with links to icons
      clear: "http://openweathermap.org/img/wn/01d@2x.png",
      clouds: "http://openweathermap.org/img/wn/02d@2x.png",
      drizzle: "http://openweathermap.org/img/wn/09d@2x.png",
      rain: "http://openweathermap.org/img/wn/10d@2x.png",
      thunderstorm: "http://openweathermap.org/img/wn/11d@2x.png",
      snow: "http://openweathermap.org/img/wn/13d@2x.png",
      mist: "http://openweathermap.org/img/wn/50d@2x.png"
    };
    var icon = "";
    if (con == "Clear") { // Set weather icon based on conditions from api query
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
    return icon;
  }

  function getUV(lat, lon) { // Search UV index separately with lat and lon
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=89361e8467bec0f20018786eac13a299&lat=" +
        lat +
        "&lon=" +
        lon,
      method: "GET"
    }).then(function(res) {
      var uvIndex = res.value;
      var background = "bg-secondary";
      if (uvIndex <= 2.99) { // Set bg color based on index number/severity
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

  function getForecast(city) { // Partial structure credit - Trilogy 06-Server-Side-APIs activities
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=89361e8467bec0f20018786eac13a299";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(res) {
      // console.log('Forecast');
      // console.log(res);
      $("#forecast-title").append("<h2>5-Day Forecast:</h2>");
      renderForecast(res);
    });
  }

  function renderForecast(res) { // Partial structure credit - Trilogy 06-Server-Side-APIs activities
    var day = 1;
    // Open Weather api uses 3 hour increments for their 5-day forecast, meaning 40 total items in the query res array
    for (i = 6; i < 39; i += 8) { // Get weather at 6pm each day, 6 is the 3rd to last item for each day, add 8 to get 6pm on the next day
      // console.log(res.list[i]);
      var date = moment() // Get date n days in the future
        .add(day, "days")
        .format("l"); 
      var dayOfWeek = moment() // Get date n days in the future
      .add(day, "days")
      .format("dddd"); 
      var temp = Math.floor((res.list[i].main.temp - 273.15) * 1.8 + 32); // Kelvin to Fahrenheit
      var humidity = res.list[i].main.humidity;
      var con = res.list[i].weather[0].main; // Get weather conditions
      var icon = getIcon(con);
      var block = `<div class="card mt-3 bg-primary rounded text-light" style="min-width: 20rem; max-width: 20rem;">
                        <div class="card-header text-center">${dayOfWeek} ${date}</div>
                        <div class="card-body text-center">
                            <img src="${icon}" />
                            <p>Temperature: ${temp}&#176;F</p>
                            <p>Humidity: ${humidity}%</p>
                        </div>
                    </div>`;
      $(".card-deck").append(block);
      day++; 
    }
  }

  function addCity(city) {
    if (city == "undefined" || city == null || history.includes(city)) {
      return;
    } else {
      history.push(city);
      storeHistory();
      renderHistory();
    }
  }

  function getHistory() { 
    var storedHistory = JSON.parse(localStorage.getItem("history"));
    if (storedHistory == null) { // If there is no history in localStorage use empty array
      history = [];
    } else {
      history = storedHistory;
    }
    renderHistory();
  }

  function storeHistory() { 
    localStorage.setItem("history", JSON.stringify(history));
  }

  function renderHistory() {
    $("#search-history").empty();
    if (history == "" || history == "undefined" || history == null) {
      return;
    } else {
      for (i = 0; i < history.length; i++) {
        var city = history[i];
        var block = `<button type="button" class="search-again list-group-item list-group-item-action">${city}</button>`;
        $("#search-history").append(block);
      }
    }
  }
});
