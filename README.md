# weather-dashboard v0.3.0

<img alt="Weather Dashboard v0.1.0 gif" src="assets/images/weather-dashboard_0-1-0.gif">


## Description
A weather app that shows basic weather data, and a 5-day forecast for a city based on user search. User search history is saved in a list that can get weather data again when the user clicks on the city name.

**Challenges**  
A few challenges in this project were creating logic to display correct icons based on weather conditions, getting the separate UV index condition using data from the original api query and creating a search bar that persists and allows users to add searches and re-search cities.  

**v0.3.0**
* IMPROVEMENT - addCity function now lives in the getWeather function so that it waits to set currentCity until api response instead of using a setTimeout

**Future Versions**
* Make the GUI prettier and less vanilla Bootstrap
* Indicate state or country, if I search "Portland" am I seeing Oregon or Maine?
* A button that allows the user to clear search history
* Feedback for users when the api does not return a result


## Usage
https://gmg300.github.io/weather-dashboard/


## Credits
[gmg300](https://github.com/gmg300)

<img alt="Bootstrap Logo" src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" width="30" height="30"> Bootstrap v4.4.1 https://getbootstrap.com/

<img alt="JQuery Logo" src="assets/images/JQuery-logo.png" width="28" height="30"> JQuery v3.4.1 https://jquery.com/

<img alt="Moment.js Logo" src="assets/images/momentjs-logo.png" width="30" height="30"> Moment.js v2.24.0 https://momentjs.com/

2019 Trilogy Education Services



