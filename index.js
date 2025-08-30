const API_KEY = "76827cbc1f927d0fff81409c13f0700b";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetching HTML elements
const cityInput = document.getElementById("cityInput");
const button = document.getElementById("button");
const errorDiv = document.getElementById("error");
const weatherDisplay = document.getElementById("weatherDisplay");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherIcon = document.getElementById("weatherIcon")

// Weather display elements
const cityNameElem = document.getElementById("cityName");
const temperatureElem = document.getElementById("temperature");
const weatherDescriptionElem = document.getElementById("weatherDescription");
const feelsLikeElem = document.getElementById("feelsLike");
const humidityElem = document.getElementById("humidity");
const windSpeedElem = document.getElementById("windSpeed");

// Event listeners
button.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// Handle search function
function handleSearch() {
    const city = cityInput.value.trim();
    
    // Input validation
    if (!city) {
        showError("Please enter a city name");
        return;
    }

    // Clear previous results and show loading
    hideAllSections();
    showLoading();
    
    // Fetch weather data
    fetchWeatherData(city);
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    try {
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            } else if (response.status === 401) {
                throw new Error("Invalid API key");
            } else {
                throw new Error("Failed to fetch weather data");
            }
        }
        
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        hideLoading();
        showError(error.message);
    }
}

// Display weather data
function displayWeatherData(data) {
    hideLoading();
    
    // Extract data from API response
    const cityNameText = `${data.name}, ${data.sys.country}`;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const feelsLikeTemp = Math.round(data.main.feels_like);
    const humidityValue = data.main.humidity;
    const windSpeedValue = Math.round(data.wind.speed);

    // Update DOM elements
    cityNameElem.textContent = cityNameText;
    temperatureElem.textContent = temp;
    weatherDescriptionElem.textContent = description;
    feelsLikeElem.textContent = feelsLikeTemp;
    humidityElem.textContent = humidityValue;
    windSpeedElem.textContent = windSpeedValue;

    // 🌤️ Set weather icon
    const iconCode = data.weather[0].icon
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    weatherIcon.src = iconUrl
    weatherIcon.alt = data.weather[0].description

    // Show weather display
    showWeatherDisplay();
}

// Show loading indicator
function showLoading() {
    loading.style.display = "block";
}

// Hide loading indicator
function hideLoading() {
    loading.style.display = "none";
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorDiv.style.display = "block";
}

// Hide error message
function hideError() {
    errorDiv.style.display = "none";
}

// Show weather display
function showWeatherDisplay() {
    weatherDisplay.style.display = "block";
}

// Hide weather display
function hideWeatherDisplay() {
    weatherDisplay.style.display = "none";
}

// Hide all sections
function hideAllSections() {
    hideLoading();
    hideError();
    hideWeatherDisplay();
}