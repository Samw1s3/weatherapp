
const weatherApiKey = "8b5fae56d0f774f071b372096e2bef5b";



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
    const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`
    
    return fetch(url).then(function (res) {
       
        return res.json();
    });
}



function getWeather(city){
    return getCurrentWeatherApi(city)
    .then(function (data) {
        console.log(data);
       const lon = data.coord.lon;
       const lat = data.coord.lat;

       return getOneCallApi(lon, lat);
    });
}

const searchForm = document.getElementById('form-search');

function iconCodeToPic(iconCode){
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function saveHistory(){
    localStorage.setItem("city", cityName);
    console.log(cityName);
}
searchForm.addEventListener('click', function(event){

    event.preventDefault();
    //User inputs city name
    const userInput = document.getElementById('input-city').value;


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

            // 5 day forecast
            // date
            //icon
            //temp
            //wind
            //humidity

            localStorage.setItem("city", cityName);
            saveHistory(cityName);





        })

})
   



// put searched city into local stoarge

//display in a list by city name
