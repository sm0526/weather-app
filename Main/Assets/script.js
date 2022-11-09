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
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
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