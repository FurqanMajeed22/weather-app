const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const userconatiner = document.querySelector(".weather-container");
const grantacessconatiner = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchfrom]");
const loadingscreen = document.querySelector(".loading-container");
const userinfocontainer = document.querySelector(".user-info-container");

// intially varaibles needed

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab")
getfromsessionstorage();

//ek kaam aur karna ha idhar

function switchTab(newtab) {
    if (newtab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newtab;
        oldTab.classList.add("current-tab");
        if (!searchform.classList.contains("active")) {
            // if search form is invisible this means user clicked on searchweather
            userinfocontainer.classList.remove("active")
            grantacessconatiner.classList.remove("active");
            searchform.classList.add("active");
        } else {
            // mai pehle search wale tab pai hoo ab your weather ko visible karna ha
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            //if we are on searched weather tab and the user clicks on your weather 
            // we have to obtain long and lat from session stoarge if we have saved..
            getfromsessionstorage();

        }
    }
}
userTab.addEventListener('click', () => {
    //pass clicked tab
    switchTab(userTab);
});
searchTab.addEventListener('click', () => {
    // pass clicked tab or on which event listener was added
    switchTab(searchTab);
});

//checks whether coordinates are present in session storage or not
function getfromsessionstorage() {

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantacessconatiner.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates) {

    const { lat, lon } = coordinates;
    // make grant container invisible 
    grantacessconatiner.classList.remove("active");
    //make loader visible
    loadingscreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderWeatherInfo(data);


    } catch (err) {
        loadingscreen.classList.remove("active");


    }
}
function renderWeatherInfo(weatherInfo) {
    // first we have to fetch the Elements 
    const cityName = document.querySelector("[data-cityname]")
    const countryIcon = document.querySelector("[data-countryicon]")
    const description = document.querySelector("[data-weatherdesccription]")
    const weathericon = document.querySelector("[data-weathericon]");
    const temperature = document.querySelector("[data-temperature]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-Humidity]");
    const cloudiness = document.querySelector("[data-cloudness]");

    //Fetch Values from WeatherInfo object and put it in UI Elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText =`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}
function getlocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition);
    } else {
        //Show an alert for no geo location support avaialble

    }
}
function showposition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
const grantacessbutton = document.querySelector("[data-grantacess]");
grantacessbutton.addEventListener('click', getlocation);
let searchinput=document.querySelector("[data-searchInput]")
searchform.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchinput=="")return;
    else
    fetchsearchweatherinfo(searchinput.value);
    
})
async function fetchsearchweatherinfo(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantacessbutton.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderWeatherInfo(data);

    }catch(err){
      //alert an error
    }


}


