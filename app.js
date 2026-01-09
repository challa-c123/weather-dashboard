const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

const cityNameEl = document.getElementById("cityName");
const conditionEl = document.getElementById("condition");
const tempEl = document.getElementById("temp");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.remove("hidden");
  statusEl.classList.toggle("error", isError);
}

function hideStatus() {
  statusEl.classList.add("hidden");
}

function showResult() {
  resultEl.classList.remove("hidden");
}

function hideResult() {
  resultEl.classList.add("hidden");
}

function toCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

async function fetchWeather(city) {
  const apiKey = window.WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("API key missing. Add it in config.js");
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "City not found");
  }

  return data;
}

function renderWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  conditionEl.textContent = data.weather?.[0]?.description ?? "—";
  tempEl.textContent = toCelsius(data.main.temp);
  feelsLikeEl.textContent = `${toCelsius(data.main.feels_like)} °C`;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${Math.round(data.wind.speed)} m/s`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    showStatus("Please enter a city name.", true);
    hideResult();
    return;
  }

  showStatus("Loading...");
  hideResult();

  try {
    const data = await fetchWeather(city);
    renderWeather(data);
    showResult();
    hideStatus();
  } catch (err) {
    showStatus(err.message, true);
    hideResult();
  }
});
