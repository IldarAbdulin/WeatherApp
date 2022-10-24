const wrapper = document.querySelector('.wrapper');
const inputPart = document.querySelector('.input-part');
const infoTxt = document.querySelector('.info-txt');
const inputField = document.querySelector('#weatherInput');
const locationBtn = document.querySelector('#locBtn');
const weatherImg = document.querySelector('.weather-img');
const arrowBack = document.querySelector('.bx-left-arrow-alt')

let api;
const url = ('fd6fb8b36d4d0ef30309752ddfe29422');

inputField.addEventListener('keyup' , (e) => {
    if(e.key == 'Enter' && inputField.value != '') {
        requestApi(inputField.value);
    }
})

locationBtn.addEventListener('click' , () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else {
        alert('Your browser not support geolocation api')
    }
})

function onSuccess(position) {
    const{latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${url}`
    fetchData()
}

function onError(error) {
    infoTxt.innerHTML = error.message;
    infoTxt.classList.add('error')
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${url}`;
    fetchData()
}
function fetchData() {
    infoTxt.innerHTML = 'Getting weather details...';
    infoTxt.classList.add('pending')
    fetch(api)
    .then(response => response.json())
    .then(result => weatherDetails(result));
}

function weatherDetails(info) {
    infoTxt.classList.replace('pending' , 'error')
    if(info.cod == '404') {
        infoTxt.innerHTML = `${inputField.value}: isn't a valid city name`;
    }else {

        const city = info.name;
        const country = info.sys.country;
        const {description , id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800) {
            weatherImg.src = 'Weather-Icons/clear.svg'
        }else if (id >= 200 && id <= 232) {
            weatherImg.src = 'Weather-Icons/storm.svg'
        }else if (id >= 600 && id <= 622) {
            weatherImg.src = 'Weather-Icons/snow.svg'
        }else if (id >= 701 && id <= 781) {
            weatherImg.src = 'Weather-Icons/haze.svg'
        }else if (id >= 801 && id <= 804) {
            weatherImg.src = 'Weather-Icons/cloud.svg'
        }else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            weatherImg.src = 'Weather-Icons/rain.svg'
        }

        wrapper.querySelector('.temp .numb').innerHTML = Math.floor(temp)
        wrapper.querySelector('.weather').innerHTML = description;
        wrapper.querySelector('.location span').innerHTML = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerHTML = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerHTML = `${humidity}%`;

        infoTxt.classList.remove('pending' , 'error');
        wrapper.classList.add('active')
        console.log(info)
    }
}

arrowBack.addEventListener('click', () => {
    wrapper.classList.remove('active')
})