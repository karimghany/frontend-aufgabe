// Init variables only once to save performance
let city;
let weather_input;
let weather_data_time;
let error_element;
let saved_weather_button;
let initial_request;
let date;
let hours;
let mins;
let time;
let url;
let params;
let icon_id;
let nav;

// Switch for geolocation errors
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      error_element.innerHTML = "Die Standortnutzung wurde abgelehnt.";
      break;
    case error.POSITION_UNAVAILABLE:
      error_element.innerHTML = "Keine Standortinformation verfügbar.";
      break;
    case error.TIMEOUT:
      error_element.innerHTML = "Zeitüberschreitung bei der Anfrage.";
      break;
    case error.UNKNOWN_ERROR:
      error_element.innerHTML = "Ein unbekannter Fehler ist aufgetreten.";
      break;
  }
}

// Passing the request using coords instead of city name
function usePosition(position) {
  sendRequest(position);
}

// Check if browser supports geolocation and get with user permission
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(usePosition, showError);
  } else {
    error_element.innerHTML = "Ihr Browser unterstützt keine Standortnutzung.";
  }
}

// Add city name next to time in weather info
function addCityToWeatherDataInfo(city_name) {
  weather_data_time.innerHTML = city_name + " " + weather_data_time.innerHTML;
}

// Check if request needs to be saved with early return
function checkStorage(city_name) {
  if (sessionStorage.getItem("city") != undefined) {
    return;
  } else {
    sessionStorage.setItem("city", city_name);
    enableSavedButton(city_name);
  }
}

// Applying gathered data to the weather widget
function displayWeatherData(data, city) {
  if (data.city != undefined) {
    weather_input.value = data.city;
    checkStorage(data.city);
    addCityToWeatherDataInfo(data.city);
  } else {
    addCityToWeatherDataInfo(city);
  }
  document.getElementsByClassName("nav__weather-data-degrees")[0].innerHTML =
    Math.round(data.temp);
  document.getElementsByClassName("nav__weather-data-text")[0].innerHTML =
    data.description;
  icon_id = "#" + data.icon;
  document
    .getElementsByClassName("nav__weather-data-icon")[0]
    .lastElementChild.setAttribute("xlink:href", icon_id);
  if (initial_request == true) {
    initial_request = false;
    return;
  } else {
    checkStorage(city);
  }
}

// Get and display current time
function getTime() {
  date = new Date();
  hours = date.getHours();
  mins = date.getMinutes();
  if (mins.toString().length == 1) {
    mins = "0" + mins;
  }
  time = hours + ":" + mins;
  weather_data_time.innerHTML = time;
}

// Send request on weather data to middleware
function sendRequest(city) {
  getTime();
  url = "http://localhost:3000/weather";
  params;
  // Pass city name or coords for middleware
  if (typeof city === "string" || city instanceof String) {
    params = {
      q: city,
    };
  } else {
    params = {
      lat: city.coords.latitude,
      lon: city.coords.longitude,
    };
  }
  url += "?" + new URLSearchParams(params).toString();

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    // Display the data on success
    .then((data) => {
      displayWeatherData(data, city);
    })
    // Display error message on error
    .catch((error) => {
      error_element.innerHTML =
        "Ein Fehler ist aufgetreten. Versuchen Sie es nach erneutem Laden der Seite nochmal.";
      console.log(error);
    });
}

// Use session storage for new request to display current weather (not weather when save was made)
function onSavedSubmit() {
  city = sessionStorage.getItem("city");
  sendRequest(city);
  weather_input.value = city;
}

// Called when first request has been saved to make it avaible to user
function enableSavedButton(city_name) {
  saved_weather_button =
    document.getElementsByClassName("nav__weather-saved")[0];
  saved_weather_button.removeAttribute("disabled");
  saved_weather_button.classList.add("nav__weather-saved--visible");
  saved_weather_button.firstElementChild.innerHTML = "Wetter " + city_name;
  saved_weather_button.addEventListener("click", onSavedSubmit);
}

// Submit request using city name or location
function onSubmit(e) {
  e.preventDefault();
  if (e.submitter.classList.contains("weather__search__button")) {
    city = weather_input.value;
    sendRequest(city);
  } else {
    // Request is send in getLocation method if successful
    getLocation();
  }
}

// Fix bug for mobile header
function resetScroll() {
  window.scrollTo(0, 0);
}

// Enable mobile header
function toggleMenu() {
  nav = document.getElementById("navigation");
  if (nav.getAttribute("aria-hidden") != "false") {
    nav.setAttribute("aria-hidden", false);
    this.setAttribute("aria-eerrorpanded", true);
    window.requestAnimationFrame(resetScroll);
  } else {
    nav.setAttribute("aria-hidden", true);
    this.setAttribute("aria-eerrorpanded", false);
  }
}

// Set neccesary variables and event listeners
function onLoad() {
  document
    .getElementsByClassName("header__menu-link")[0]
    .addEventListener("click", toggleMenu);
  document
    .getElementsByClassName("nav__weather-form")[0]
    .addEventListener("submit", onSubmit);
  weather_input = document.querySelector("#geocoder input");
  weather_input.classList.add("search__input");
  weather_input.value = "Hamburg";
  weather_data_time = document.getElementsByClassName(
    "nav__weather-data-time"
  )[0];
  error_element = document.getElementsByClassName("error")[0];
  // Check session storage for previously used city
  if (sessionStorage.getItem("city") != undefined) {
    onSavedSubmit();
    enableSavedButton(city);
  } else {
    city = weather_input.value;
    initial_request = true;
    sendRequest(city);
  }
}

window.addEventListener("load", onLoad);
