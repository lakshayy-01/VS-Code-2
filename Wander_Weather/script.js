
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");

const weatherSection = document.getElementById("weatherSection");
const weatherLocation = document.getElementById("weatherLocation");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const forecastSection = document.getElementById("forecastSection");
const forecastGrid = document.getElementById("forecastGrid");

const recommendationsSection = document.getElementById("recommendationsSection");
const recommendationGrid = document.getElementById("recommendationGrid");

const budgetForm = document.getElementById("budgetForm");
const budgetDestination = document.getElementById("budgetDestination");
const tripDays = document.getElementById("tripDays");
const tripBudget = document.getElementById("tripBudget");
const budgetResult = document.getElementById("budgetResult");
const budgetMessage = document.getElementById("budgetMessage");

const weatherConditions = {
    0: { description: "Clear Sky", icon: "☀️" },
    1: { description: "Mainly Clear", icon: "🌤️" },
    2: { description: "Partly Cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Fog", icon: "🌫️" },
    48: { description: "Fog", icon: "🌫️" },
    51: { description: "Light Drizzle", icon: "🌦️" },
    53: { description: "Drizzle", icon: "🌦️" },
    55: { description: "Heavy Drizzle", icon: "🌧️" },
    61: { description: "Light Rain", icon: "🌧️" },
    63: { description: "Moderate Rain", icon: "🌧️" },
    65: { description: "Heavy Rain", icon: "🌧️" },
    71: { description: "Light Snow", icon: "🌨️" },
    73: { description: "Snow", icon: "❄️" },
    75: { description: "Heavy Snow", icon: "❄️" },
    80: { description: "Rain Showers", icon: "🌦️" },
    81: { description: "Rain Showers", icon: "🌧️" },
    82: { description: "Heavy Rain Showers", icon: "🌧️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm", icon: "⛈️" },
    99: { description: "Heavy Thunderstorm", icon: "⛈️" }
};


const destinations = [
    {
        name: "Manali",
        latitude: 32.2432,
        longitude: 77.1892,
        icon: "🏔️",
        description: "Beautiful mountains and peaceful valleys."
    },
    {
        name: "Goa",
        latitude: 15.4909,
        longitude: 73.8278,
        icon: "🏖️",
        description: "Explore beaches and beautiful sunsets."
    },
    {
        name: "Jaipur",
        latitude: 26.9124,
        longitude: 75.7873,
        icon: "🏰",
        description: "Discover royal palaces and rich culture."
    },
    {
        name: "Shimla",
        latitude: 31.1048,
        longitude: 77.1734,
        icon: "🌲",
        description: "Enjoy scenic hills and mountain views."
    },
    {
        name: "Udaipur",
        latitude: 24.5854,
        longitude: 73.7125,
        icon: "🏞️",
        description: "Experience lakes and beautiful architecture."
    }
];
  
async function loadRecommendations() {

    try {

        const results = await Promise.all(
            destinations.map(async (destination) => {

                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${destination.latitude}&longitude=${destination.longitude}&current=temperature_2m,weather_code&timezone=auto`
                );

                if (!response.ok) {
                    throw new Error("Destination weather unavailable");
                }

                const data = await response.json();

                const current = data.current;

                const condition = weatherConditions[current.weather_code] || {
                    description: "Unknown",
                    icon: "🌤️"
                };

                const isSuitable =
                    current.temperature_2m >= 18 &&
                    current.temperature_2m <= 30 &&
                    [0, 1, 2, 3].includes(current.weather_code);

                return {
                    ...destination,
                    temperature: current.temperature_2m,
                    weather: condition.description,
                    weatherIcon: condition.icon,
                    isSuitable: isSuitable
                };

            })
        );

        const suitableDestinations = results.filter(
    destination => destination.isSuitable
);

if (suitableDestinations.length === 0) {

    recommendationGrid.innerHTML = `
        <p class="no-recommendations">
            No suitable destinations right now.
            Please try again later!
        </p>
    `;

    recommendationsSection.hidden = false;
    return;
}
       recommendationGrid.innerHTML = suitableDestinations.map((destination) => {
            return `
                <div class="recommendation-card">

                    <div class="recommendation-icon">
                        ${destination.icon}
                    </div>

                    <h3>${destination.name}</h3>

                    <p>${destination.description}</p>

                    <div class="recommendation-weather">
                        ${destination.weatherIcon}
                        ${Math.round(destination.temperature)}°C
                        · ${destination.weather}
                    </div>

                    <p>
                        ${destination.isSuitable
                            ? "✅ Recommended for a visit"
                            : "ℹ️ Check conditions before travelling"}
                    </p>

                </div>
            `;

        }).join("");

        recommendationsSection.hidden = false;

    } catch (error) {

        console.error(error);

        recommendationGrid.textContent =
            "Unable to load destination recommendations.";

        recommendationsSection.hidden = false;

    }

}





searchForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    weatherSection.hidden = true;
    forecastSection.hidden = true;

    recommendationsSection.hidden = true;

    message.textContent = "Fetching weather...";

    try {

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Location request failed");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            message.textContent = "City not found!";
            return;
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;
        const daily = weatherData.daily;

        if (!current || !daily || !daily.time) {
            throw new Error("Weather data is incomplete");
        }

        const condition = weatherConditions[current.weather_code] || {
            description: "Weather information",
            icon: "🌤️"
        };

        weatherLocation.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        feelsLike.textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;

        weatherDescription.textContent = condition.description;

        weatherIcon.textContent = condition.icon;

        forecastGrid.innerHTML = daily.time.map((date, index) => {

            const dateObject = new Date(`${date}T12:00:00`);

            const dayName = dateObject.toLocaleDateString(
                "en-US",
                { weekday: "short" }
            );

            const forecastCondition =
                weatherConditions[daily.weather_code[index]] || {
                    description: "Unknown",
                    icon: "🌤️"
                };

            return `
                <div class="forecast-card">

                    <h3>${dayName}</h3>

                    <div class="forecast-icon">
                        ${forecastCondition.icon}
                    </div>

                    <div class="forecast-temp">
                        ${Math.round(daily.temperature_2m_max[index])}° /
                        ${Math.round(daily.temperature_2m_min[index])}°
                    </div>

                    <p class="forecast-condition">
                        ${forecastCondition.description}
                    </p>

                </div>
            `;

        }).join("");

        weatherSection.hidden = false;
        forecastSection.hidden = false;

        await loadRecommendations();

        message.textContent = "Weather updated successfully!";

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to fetch weather. Please try again!";

    }

});


const dailyTripEstimates = {
    Manali: 3500,
    Goa: 4500,
    Jaipur: 3000,
    Shimla: 3500,
    Udaipur: 3800
};

budgetForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const destination = budgetDestination.value;
    const days = Number(tripDays.value);
    const budget = Number(tripBudget.value);

    if (!destination || days < 1 || days > 30 || budget <= 0) {
        budgetMessage.textContent = "Please enter valid trip details!";
        budgetResult.hidden = true;
        return;
    }

    const dailyCost = dailyTripEstimates[destination];

    const estimatedTotal = dailyCost * days;

    const remainingBudget = budget - estimatedTotal;

    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    });

    const isAffordable = estimatedTotal <= budget;

    budgetResult.innerHTML = `

        <h3> Your Trip Estimate </h3>

        <p>Destination: <strong>${destination}</strong></p>

        <p>Trip Duration: <strong>${days} Days</strong></p>

        <p>Estimated Daily Cost:
            <strong>${formatter.format(dailyCost)}</strong>
        </p>

        <p>Estimated Total Cost:
            <strong>${formatter.format(estimatedTotal)}</strong>
        </p>

        <p>Your Budget:
            <strong>${formatter.format(budget)}</strong>
        </p>

        <h3>
            ${isAffordable
                ? "✅ Your trip is within budget!"
                : "⚠️ Your budget is not sufficient."}
        </h3>

        <p>
            ${isAffordable
                ? "Remaining Budget: " + formatter.format(remainingBudget)
                : "Extra Amount Needed: " + formatter.format(Math.abs(remainingBudget))}
        </p>

    `;

    budgetResult.hidden = false;
    budgetMessage.textContent = "Estimated trip cost calculated successfully!";

});

