// These import necessary modules and set some initial variables
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
const app = express();
const port = 3000;
const path = require("path");

// Limit api consumption according to exercise
const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute
});

// Apply to all requests
app.use(limiter);

// Allow CORS from any origin
app.use(cors());

// Allow files in public folder
app.use(express.static(path.join(__dirname, "/public")));

// Handle requests to new weather-endpoint and get results from API
app.get("/weather", async (req, res) => {
  /* Convert city name to location via geocoding or take coords if location was used */
  let city;
  try {
    let lat;
    let lon;
    if (req.query.q != undefined) {
      const searchString = `q=${req.query.q}`;
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?${searchString}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
      );
      const json = await response.text();
      const results = JSON.parse(json);

      lat = results[0].lat;
      lon = results[0].lon;
    } else {
      lat = req.query.lat;
      lon = req.query.lon;

      /* Use reverse geocoding if location was used for ability to display city name later */
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
      );
      const json = await response.text();
      const results = JSON.parse(json);

      city = results[0].local_names.de;
    }
    /* Get actual weather data and return only necessary results */
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric&lang=de`
      );
      const json = await response.text();
      const results = JSON.parse(json);

      return res.json({
        success: true,
        temp: results.main.temp,
        description: results.weather[0].description,
        icon: results.weather[0].icon,
        city: city,
      });
    } catch (err) {
      /* Catch errors getting weather data */
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  } catch (err) {
    /* Catch error for direct and reverse geocoding */
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
