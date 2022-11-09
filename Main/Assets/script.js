//global variables
const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'ac50d784bf914987a46bfec9b1157873';
let history = [];
//DOM element variables
let searchForm = document.querySelector('#search-form');
let searchInput = document.querySelector('#search-input');
let today = document.querySelector('#today');
let forecast = document.querySelector('#forecast');
let searchHistory = document.querySelector('#history');
//dayjs
dayjs.extend(window.dayjs_plugin_timezone);
dayjs.extend(window.dayjs_plugin_utc);
//functions to display results, history, and to update history
function showSearchHistory() {
    searchHistory.innerHTML = '';
    for (let i = history.length -1; i >= 0; i--) {
        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('aria-controls', 'today forecast');
        button.classList.add('history-button', 'button-history');
        button.setAttribute('data-search', history[i]);
        button.textContent = history[i];
        searchHistory.append(button);
    }
}
function appendToHistory(search) {
    if (history.indexOf(search) !== -1) {
        return;
    }
    history.push(search);
    localStorage.setItem('search-history', JSON.stringify(history));
    showSearchHistory();
}
function initSearchHistory() {
    let storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        history = JSON.parse(storedHistory);
    }
    showSearchHistory();
}
function showCurrentWeather(city, weather, timezone){
    let date = dayjs().tz(timezone).format('M/D/YYYY');
    let temp = weather.temp;
    let windMph = weather.wind_speed;
    let uvi = weather.uvi;
    let humidity = weather.humidity;
    //creating dom elements to show data
    let card = document.createElement('div');
    let cardBody = document.createElement('div');
    let heading = document.createElement('h3');
    let tempEl = document.createElement('p');
    let windMphEl = document.createElement('p');
    let uviEl = document.createElement('p');
    let humidityEl = document.createElement('p');
    //outline
    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);
    //data
    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windMphEl.setAttribute('class', 'card-text');
    uviEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
    //content
    heading.textContent = `${city} (${date})`;
    tempEl.textContent = `Temperature: ${temp}°F`;
    windMphEl.textContent = `Wind Speed: ${windMph} MPH`;
    uviEl.textContent = `UV Index: ${uvi}`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windMphEl, uviEl, humidityEl);
    today.innerHTML = '';
    today.append(card);
}
function showForecastCard(forecast, timezone) {
    let unixTs = forecast.dt;
    let tempF = forecast.temp.day;
    let { humidity } = forecast;
    let windMph = forecast.wind_speed;
    //dom variables to create the card
    let col = document.createElement('div');
    let card = document.createElement('div');
    let cardBody = document.createElement('div');
    let cardTitle = document.createElement('h4');
    let tempFEl = document.createElement('p');
    let windMphEl = document.createElement('p');
    let humidityEl = document.createElement('p');
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, tempFEl, windMphEl, humidityEl);
    //setting class' for card
    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempFEl.setAttribute('class', 'card-text');
    windMphEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
    cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');
    tempFEl.textContent = `Temperature: ${tempF}°F`;
    windMphEl.textContent = `Wind Speed: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    forecast.append(col);
}
function showForecast(dailyForecast, timezone) {
    let startDate = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    let endDate = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();
    let headingCol = document.createElement('div');
    let heading = document.createElement('h4');
    headingCol.setAttribute('class', 'col-12');
    heading.textContent = 'Five Day Forecast:';
    headingCol.append(heading);
    forecast.innerHTML = '';
    forecast.append(headingCol);
    for (let i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDate && dailyForecast[i].dt < endDate) {
            showForecastCard(dailyForecast[i], timezone);
        }
    }
}
function showItems(city, data) {
    showCurrentWeather(city, data.current, data.timezone);
    showForecast(data.daily, data.timezone);
}
function fetchWeather(location) {
    let { lat } = location;
    let { lon } = location;
    let city = location.name;
    let apiUrl =`${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            showItems(city, data);
        })
        .catch(function (err) {
            console.error(err);
        })
}
function fetchCoordinates(search) {
    let apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('Location cannot be found');
            } else {
                appendToHistory(search);
                fetchWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        })
}