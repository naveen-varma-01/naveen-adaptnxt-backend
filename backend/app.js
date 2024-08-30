const express = require("express");
const axios = require("axios");
const app = express();

const API_KEY = "f7527bde0ed8e650aab53a7f54040338";
const BASE_URL = "http://api.weatherstack.com/current";

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
        <form action="/weather" method="get">
            <input type="text" id="city" name="city" placeholder="Enter city name">
            <button type="submit">Get Weather</button>
        </form>
    `);
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.send("Please enter a city name.");
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        access_key: API_KEY,
        query: city,
      },
    });

    if (response.data.error) {
      return res.send(`Error: ${response.data.error.info}`);
    }

    const weatherData = response.data.current;
    res.send(`
            <h1>Weather in ${city}</h1>
            <p>Temperature: ${weatherData.temperature}&degC</p>
            <p>Weather Descriptions: ${weatherData.weather_descriptions.join(
              ", "
            )}</p>
            <p>Humidity: ${weatherData.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind_speed} km/h</p>
            <a href="/">Back</a>
        `);
  } catch (error) {
    res.send("An error occurred while fetching weather data.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});