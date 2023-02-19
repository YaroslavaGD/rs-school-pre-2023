const TIME_OF_DAY = ['morning', 'afternoon', 'evening', 'night'];
let backgroundNumber = 1;


const body = document.querySelector('body');
const timeOutput = document.querySelector('.time');
const dateOutput = document.querySelector('.date');
const greetingOutput = document.querySelector('.greeting');

const nameInput = document.querySelector('.name');


const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');


const weatherIconOutput = document.querySelector('.weather-icon');
const temperatureOutput = document.querySelector('.temperature');
const weatherDescriptionOutput = document.querySelector('.weather-description');
const windOutput = document.querySelector('.wind');
const humidityOutput = document.querySelector('.humidity');
const weatherErrorOutput = document.querySelector('.weather-error');

const cityInput = document.querySelector('.city');


const changeQuoteButton = document.querySelector('.change-quote');
const quoteOutput = document.querySelector('.quote');
const authorOutput = document.querySelector('.author');


showTime();
setRandomBackgroundNum(1,20);
setBackground();
getQuotes();


//====================== TIME AND DATE ======================
function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  timeOutput.textContent = currentTime;
  showDate();

  showGreeting();

  setTimeout(showTime, 1000);
}

function showDate() {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = date.toLocaleDateString('de-De', options);
  dateOutput.textContent = currentDate;
}

function getTimeOfDay(){
  const date = new Date();
  const hours = date.getHours();
  
  if (hours >= 0 && hours < 12) return TIME_OF_DAY[0];
  
  if (hours >= 12 && hours < 17) return TIME_OF_DAY[1];
  
  if (hours >= 17 && hours < 20) return TIME_OF_DAY[2];
  
  if (hours >= 20 && hours < 24) return TIME_OF_DAY[3];

  return TIME_OF_DAY[0];
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  const greetingText = `Good ${timeOfDay},`;
  greetingOutput.textContent = greetingText;
}


//====================== LOCAL STORAGE ======================
function setLocalStorage() {
  localStorage.setItem('name', nameInput.value);
  localStorage.setItem('city', cityInput.value);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  const nameLocalStorage = localStorage.getItem('name');
  const cityLocalStorage = localStorage.getItem('city');
  if (nameLocalStorage) {
    nameInput.value = nameLocalStorage;
  }

  if (cityLocalStorage) {
    cityInput.value = cityLocalStorage;
    getWeather();
  }
}
window.addEventListener('load', getLocalStorage);


//====================== BACKGROUND AND SLIDER ======================
function getRandomNum(min, max) {
  const minNew = Math.ceil(min);
  const maxNew = Math.floor(max);
  return Math.floor(Math.random() * (maxNew - minNew + 1)) + minNew;
}

function setRandomBackgroundNum(min, max) {
  backgroundNumber = getRandomNum(min, max);
}

function setBackground(){
  const timeOfDay = getTimeOfDay();

  let backgroundName =  backgroundNumber < 10 ? "0" + backgroundNumber : backgroundNumber;
  const img = new Image();

  img.src = `https://raw.githubusercontent.com/YaroslavaGD/stage1-tasks/assets/images/${timeOfDay}/${backgroundName}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  }
}

function getSlideNext() {
  backgroundNumber = backgroundNumber == 20 ? 1 : backgroundNumber + 1;
  setBackground();
}
slideNext.addEventListener('click', getSlideNext);

function getSlidePrev() {
  backgroundNumber = backgroundNumber == 1 ? 20 : backgroundNumber - 1;
  setBackground();
}
slidePrev.addEventListener('click', getSlidePrev);


//====================== WEATHER ======================

async function getWeather () {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=ru&appid=a8ac1027e738e7638e87d25781881790&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIconOutput.className = 'weather-icon owf';
    weatherIconOutput.classList.add(`owf-${data.weather[0].id}`);
    temperatureOutput.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescriptionOutput.textContent = data.weather[0].description;
    windOutput.textContent = `Wind speed:\u00A0${data.wind.speed.toFixed(0)}м/с`;
    humidityOutput.textContent = `Humidity:\u00A0${data.main.humidity}%`;
    weatherErrorOutput.textContent = '';
  } catch (error) {
    weatherErrorOutput.textContent = 'City "' + cityInput.value + '" not found.';
    weatherIconOutput.className = 'weather-icon owf';
    temperatureOutput.textContent = '';
    weatherDescriptionOutput.textContent = '';
    windOutput.textContent = '';
    humidityOutput.textContent = '';
  }
}

function setWeather(event) {
  if(event.code === 'Enter') {
    getWeather();
    cityInput.blur();
  }
}
cityInput.addEventListener('keypress', setWeather);


//====================== QUOTES ======================

async function getQuotes() {
  const quotes = 'data.json';
  const res = await fetch(quotes);
  const data = await res.json();

  const randomNumber = getRandomNum(0, data.length - 1);

  quoteOutput.textContent = '"' + data[randomNumber].text + '"';
  authorOutput.textContent = data[randomNumber].author;
}
changeQuoteButton.addEventListener('click', getQuotes);