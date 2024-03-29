document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('cityInput').value;
  // Add city to city history
  const cityHistory = document.getElementById('cityHistory');
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  li.textContent = city;
  cityHistory.appendChild(li);
  // Clear input field
  document.getElementById('cityInput').value = '';
  // Fetch weather data and update current weather and five day forecast
  fetchWeather(city);
});

async function fetchWeather(city) {
  // Implement fetching weather data from an API and updating the UI
  // This is a placeholder function for demonstration purposes
  const currentWeather = document.getElementById('currentWeather');
  currentWeather.textContent = `Current weather for ${city}`;
  const fiveDayForecast = document.getElementById('fiveDayForecast');
  fiveDayForecast.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('col-2','box');
    dayDiv.textContent = `Day ${i+1} Forecast for ${city}`;
    fiveDayForecast.appendChild(dayDiv);
  }
}

async function fetchWeather(city) {
  //var apiKey =  "8e2a29d88c6f38aa378764abe63829c9"
  var apiKey = 'c88c041873c88fa8bc608b33404b1a02'; 

  // current weather api
  var apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&limit=5&appid=${apiKey}&units=metric`;

  // five-day forecast api
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&limit=5&appid=${apiKey}&units=metric`;
  
   
  
 fetch(apiUrl)
 .then((response) => {
    if (!response.ok) throw new Error(response.statusText);
     return response.json()
 }) 
 .then(data => { 
    console.log(data);
    displayWeather(data); 
 })
 .catch(error => {    
    var error = 'Error fetching city weather, or no such city exist'
    //console.log(response.statusText)
     displayError(error)
   
 });
}