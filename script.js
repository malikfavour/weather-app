const API_KEY = "683bbdbfaed84b8198480945261007";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentWeather = document.getElementById("currentWeather");
const forecastContainer = document.getElementById("forecastContainer");
const changes = document.getElementById("changes");
const loader = document.getElementById("loader");


searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city === ""){
        alert("Please enter a city.");
        return;
    }

    getWeather(city);

});
    cityInput.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        searchBtn.click();

    }

});


async function getWeather(city){

    try{
        // Show Loader
        loader.classList.remove("hidden");

        currentWeather.innerHTML = "";
        forecastContainer.innerHTML = "";
        changes.innerHTML = "";

        const url =
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`;

        const response = await fetch(url);

        if(!response.ok){
            throw new Error("Unable to fetch weather data.");
        }

        const data = await response.json();
        if(data.error){
            throw new Error(data.error.message);
        }

        // Hide Loader
        loader.classList.add("hidden");

        currentWeather.innerHTML = `
            <h2>${data.location.name}, ${data.location.country}</h2>

            <h1>${data.current.temp_c}°C</h1>

            <p>${data.current.condition.text}</p>

            <p>Humidity: ${data.current.humidity}%</p>

            <p>Wind: ${data.current.wind_kph} km/h</p>

            <p>Feels Like: ${data.current.feelslike_c}°C</p>
        `;

        // Forecast
        forecastContainer.innerHTML = "";

        for(const day of data.forecast.forecastday){
            forecastContainer.innerHTML += `
                <div class="forecast-card">
                    <h3>${day.date}</h3>
                    <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                    <p>${day.day.condition.text}</p>
                    <p>High: ${day.day.maxtemp_c}°C</p
                    <p>Low: ${day.day.mintemp_c}°C</p>
                </div>
            `;
        }

        // Weather Changes
        changes.innerHTML = "";
        for(let i = 0; i < data.forecast.forecastday.length - 1; i++){

            const today = data.forecast.forecastday[i];
            const tomorrow = data.forecast.forecastday[i + 1];
            const difference = tomorrow.day.maxtemp_c - today.day.maxtemp_c;
            if(difference > 0){
                changes.innerHTML += `
                    <div class="change-item">
                        ${tomorrow.date} will be
                        ${difference.toFixed(1)}°C warmer.
                    </div>
                `;
            }
            else if(difference < 0){
                changes.innerHTML += `
                    <div class="change-item">
                        ${tomorrow.date} will be
                        ${Math.abs(difference).toFixed(1)}°C cooler.
                    </div>
                `;
            }
            else{
                changes.innerHTML += `
                    <div class="change-item">
                        ${tomorrow.date} will have the same temperature.
                    </div>
                `;
            }
        }
    }
    catch(error){

        // Hide Loader
        loader.classList.add("hidden");

        currentWeather.innerHTML = `
            <div class="error-card">

                <h2>⚠ Weather Not Found</h2>

                <p>${error.message}</p>

                <p>Please check the city name and try again.</p>

            </div>
        `;
        forecastContainer.innerHTML = "";
        changes.innerHTML = "";
    }
}