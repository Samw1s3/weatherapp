//User inputs city name
const weatherApiKey = "8b5fae56d0f774f071b372096e2bef5b";

// call api to retrieve the data

//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// call current weather api
function getCurrentWeatherApi(city){
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`; 
    
    return fetch (url).then(function(response){
        return response.json();
    })
   

}

//getCurrentWeatherApi('perth');

function getOneCallApi(lon,lat){

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${weatherApiKey}`

    return fetch(url).then(function(res){
        return res.json();
    })
}

function getWeather(city){
    return getCurrentWeatherApi('perth')
    .then(function(data){
        console.log(data);
       const lon = data.coord.lon;
       const lat = data.coord.lat;

       return getOneCallApi(lon, lat);
    });
}

getWeather('perth')
    .then(function (data){
       console.log(data); 
    })
// call onecall api
//data: we need
//for today
// temp
// icon
//wind
//humidity
//uvi


// 5 day forecast
// date
//icon
//temp
//wind
//humidity


// put searched city into local stoarge

//display in a list by city name
