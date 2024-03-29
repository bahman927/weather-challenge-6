      // Check if the "cities" item exists in local storage
if (localStorage.getItem("cities")) {
  // Remove the "cities" item from local storage
  localStorage.removeItem("cities");
  console.log("Removed 'cities' from local storage.");
}  

const cityHistory = document.getElementById('cityHistory');
cityHistory.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    clearDiv();
    city = event.target.textContent;
    fetchWeather(city);
   } 
  
})   
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  clearDiv();
  let city = document.getElementById('cityInput').value;
  if (  city !== ' ' && city !== ''){  
      checkCityExists(city).then((exists) => {
      //   console.log(`${city} exists: ${exists}`);
        if(exists) {
          const checked = checkStorage(city);       
          if (!checked) {  
            // Add city to city history
            const li = document.createElement('li');
            li.textContent = city;
            li.classList.add('list-group-item','mb-3', 'gray', 'col-12');
            cityHistory.appendChild(li);
            addCity(city); 
          }

        // Fetch weather data and update current weather and five day forecast
        fetchWeather(city);
        }
      });
    document.getElementById('cityInput').value = '';
    }
}
);
  
async function fetchWeather(city) {
  //var apiKey =  "8e2a29d88c6f38aa378764abe63829c9"
  var apiKey = 'c88c041873c88fa8bc608b33404b1a02'; 

  // current weather api
   var apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&limit=5&appid=${apiKey}&units=metric`;

   fetch(apiUrl1)
    .then((response) => {
    if (!response.ok) throw new Error(response.statusText);
     return response.json()
    }) 
    .then(data => { 
    
    displayWeatherCurrent(data); 
    })
    .catch(error => {    
      var error = 'Error fetching city weather, or no such city exist'
     
   //  displayError(error)
    })

  // five-day forecast api
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&limit=5&appid=${apiKey}&units=metric`;
  
 fetch(apiUrl)
 .then((response) => {
    if (!response.ok) throw new Error(response.statusText);
     return response.json()
 }) 
 .then(data => { 
    displayWeather(data); 
 })
 .catch(error => {    
    var error = 'Error fetching city weather, or no such city exist'
    //console.log(response.statusText)
   //  displayError(error)
   
 });
}

function displayWeatherCurrent(data) {
  const date = new Date();
  const month = date.getMonth() + 1; // Months are zero-based, so we add 1
  const day = date.getDate();
  const year = date.getFullYear();
  var weatherInfo = document.getElementById('currentWeather'); 
  var dayDiv1 = document.createElement('div');    
  dayDiv1.classList.add('row');   
  dayDiv1.innerHTML = `
        <div  class='col-md-6'>
          <h3 class="text-xl mb-2"> ${data.name} (${month}/${day}/${year})</h3>
          <p class="mb-2 mt-2">Temp: ${data.main.temp}°C</p>
          <p class="mb-2">Wind: ${data.wind.speed} MPH</p>
          <p class="mb-2">Humidity: ${data.main.humidity}%</p>
        </div>
        <div class='col-md-4  ml-sm-1 ml-md-1 ml-lg-1'>
          <img id = "icon-Img1" class='img-fluid pl-1' >
        </div>
      `;     
       
        
  weatherInfo.appendChild(dayDiv1);
  document.getElementById('icon-Img1').src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"; 
     

 }

function displayWeather(data) {

  // Extract and display the forecast for the next 5 days
  // api for weather forecast are stored for every 3 hours, so
  // in order to get the next day api, loop should be iterated +7

  for (var i = 7; i < data.list.length; i += 7){
    const day = data.list[i];
    const d = new Date(day.dt_txt.toString().substring(0,11))
    // change the format of display date
    const date = d.getMonth()+1 +"/" + d.getDate()+ "/" + d.getFullYear();  
    var weatherInfoDiv = document.getElementById('fiveDayForecast');
   // weatherInfoDiv.classList.add("col-12", "col-sm-6",  "col-md-4", "col-lg-3")
    dayDiv = document.createElement('div');
    dayDiv.classList.add('box','col-12', "col-sm-6", "col-lg-3"); // 'box' 'col-md-4'
    // ''col-md-4', 'col-lg-3' 'col-2',
    var newImg = document.createElement("img");
    const icon = newImg.src = "https://openweathermap.org/img/wn/" + day.weather[0].icon + ".png"; // URL of the image
    
    dayDiv.innerHTML = `
      <h5 class="text-xl mb-2"> ${date}</h5> 
      <img class="mb-2" src='${icon}'</img>  
      <p class="mb-2">Temp: ${day.main.temp}°C</p>
      <p class="mb-2">Wind: ${day.wind.speed} MPH</p>
      <p class="mb-2">Humidity: ${day.main.humidity}%</p>
        
    `;
    
    weatherInfoDiv.appendChild(dayDiv);     
 }
}
// clear all input value
function clearDiv() {
  var div = document.getElementById("fiveDayForecast");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  var div1 = document.getElementById("currentWeather");
  while (div1.firstChild) {
    div1.removeChild(div1.firstChild);
  }
}

// add new city to local storage
function addCity(city) {
    let cities = localStorage.getItem('cities');

    if (!cities) {
        cities = [];
    } else {
        cities = JSON.parse(cities);
    }

    cities.push(city.toLowerCase());
    localStorage.setItem('cities', JSON.stringify(cities));
}
// check local storage if exists
function checkStorage(city) {
  // Retrieve the list of cities from local storage
  let cities = localStorage.getItem('cities');

  if (cities) {
      cities = JSON.parse(cities);

      // Check if the new city exists in the list
      if (cities.includes(city.toLowerCase())) {
          return true;
      } else {
          return false
      }
  } else {
      console.log('No cities found in local storage.');
  }
  
}

async function checkCityExists(city) {
    var apiKey = 'c88c041873c88fa8bc608b33404b1a02'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
      try {
          const response = await fetch(apiUrl);
          if (response.ok) {
              return true; // City exists
          } else {
              return false; // City doesn't exist
          }
      } catch (error) {
          console.error('Error checking city:', error);
          return false; // City doesn't exist
      }
  }
  
   
  

 