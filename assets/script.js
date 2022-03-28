
const weatherApiKey = "8b5fae56d0f774f071b372096e2bef5b";
const clearHistoryButton = document.getElementById('clear-button');
const searchedHistory = document.getElementById('search-history');
const searchedCities = JSON.parse(localStorage.getItem("cities")) || [];

//display in a list by city name
function renderHistory(){
    searchedHistory.innerHTML = "";

    for (let index = 0; index < searchedCities.length; index++) {
        const cityName = searchedCities[index];
        const button = document.createElement("button");
        button.setAttribute("class", "city-button");
        
        button.innerHTML = cityName;
         button.addEventListener('click', function(event){
            event.preventDefault();
            const city = button.innerHTML;
            console.log(city);
            document.getElementById("input-city").value = city;
            document.getElementById('form-search').submit();
            })

      searchedHistory.appendChild(button);
    }
}
renderHistory();
clearHistoryButton.addEventListener('click',function(event){
    localStorage.clear();
    window.location.reload();
})


//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

function getCurrentWeatherApi(city){
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`; 
   
    return fetch (url).then(function(response){
               return response.json();
    });
}


// call oncecall API
function getOneCallApi(lon,lat){
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`
    
    return fetch(url).then(function (res) {
       
        return res.json();
    });
}



function getWeather(city){
    return getCurrentWeatherApi(city)
    .then(function (data) {
        // console.log(data);
       globalThis.lon = data.coord.lon;
       globalThis.lat = data.coord.lat;

       return getOneCallApi(lon, lat);
    });
}

const searchForm = document.getElementById('form-search');

function iconCodeToPic(iconCode){
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function saveHistory(){
    localStorage.setItem("cities", JSON.stringify(searchedCities));
    console.log(searchedCities);
}
searchForm.addEventListener('submit', function(event){

    event.preventDefault();
    
    //User inputs city name
    const userInput = document.getElementById('input-city').value;
    // put searched city into local stoarge
    if (userInput != '' && searchedCities.includes(userInput) === false) {
        searchedCities.push(userInput);
    }
    // call api to retrieve the data by city
    // call current weather api
    getWeather(userInput)
        .then(function(weatherData){
            
            //data: we need

            //for today
            const cityName = userInput;
            const tempToday = weatherData.current.temp;
            const windToday = weatherData.current.wind_speed;
            const humToday = weatherData.current.humidity;
            const uviToday = weatherData.current.uvi;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;
            document.getElementById('span-date-today').textContent = today;
           // icon
            document.getElementById('today-icon').src=iconCodeToPic(weatherData.current.weather[0].icon);
            document.getElementById('span-city-name').textContent = cityName;
           // temp 
           document.getElementById('span-today-temp').textContent = tempToday.toFixed(1);
           //wind
           document.getElementById('span-today-wind').textContent = windToday.toFixed(1);
            //humidity
           document.getElementById('span-today-humidity').textContent = humToday.toFixed(0);  
            //uvi
            document.getElementById('span-today-uvi').textContent = uviToday.toFixed(0);

            var uviColor = document.getElementById("span-today-uvi");
            
            if (uviToday < 3) {
                uviColor.classList.add("green");
            }
            else if (uviToday >2 & uviToday < 6) {
                uviColor.classList.add("yellow");
            }
            else if (uviToday >5 & uviToday < 8) {
                uviColor.classList.add("orange");
            }
            else { 
                uviColor.classList.add("red");
            }     
            
            // 5 day forecast
            // date
            //icon
            //temp
            //wind
            //humidity
            globalThis.forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;
            getWeatherText(forecastURL);
        
        
        async function getWeatherText(forecastURL) {
            let weatherObject = await fetch(forecastURL);
            let weatherText = await weatherObject.text();
            parseWeather(weatherText);
        }
        
        let parseWeather = function(weatherText) {
            let weatherJSON = JSON.parse(weatherText);
            let dailyForecast = weatherJSON.daily;
            console.log(dailyForecast);
            for (x = 0; x < 5; ++x) {
                let day = dailyForecast[x];
                let today = new Date().getDay() + x;
                if (today > 6) {
                    today = today - 7;
                }
                console.log("today is",today);
                let dayOfWeek = getDayOfWeek(today);
                let description = day.weather[0].description;
                let icon = day.weather[0].icon;
                let temp = day.temp.max;
                let windSpeed = day.wind_speed;
                let humidity = day.humidity;
                displayWeatherDay(dayOfWeek, description, icon, temp, windSpeed, humidity)
            }
        }
        
        let displayWeatherDay = function(dayOfWeek, description, icon, temp, windSpeed, humidity){
            let out = "<div class=' forecast-card'><img src='http://openweathermap.org/img/wn/" + icon + "@2x.png'>"
            out += "<h4>" + dayOfWeek + "</h4>";
            out += "<p>Temp: " + temp + "°C</p>";
            out += "<p>Wind Speed: " + windSpeed + "m/s</p>";
            out += "<p>Humidity: " + humidity + "%</p>";
            document.getElementById("forecast").innerHTML += out;
            
        }
        
        let getDayOfWeek = function(dayNum) {
            var weekday = new Array(7);
            weekday[0] = "Sunday"
            weekday[1] = "Monday"
            weekday[2] = "Tuesday"
            weekday[3] = "Wednesday"
            weekday[4] = "Thursday"
            weekday[5] = "Friday"
            weekday[6] = "Saturday"
        
            return weekday[dayNum];
        
        }
                      
            })
            
                
        
            
        
          
            saveHistory(searchedCities);
            
        })
    renderHistory(searchedCities);
   


// User's history save and on click it will bring up old searches

  

 




