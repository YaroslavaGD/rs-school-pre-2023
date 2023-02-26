import playList from "./playList.js";
const TIME_OF_DAY = ['morning', 'afternoon', 'evening', 'night'];
const LOCAL_LANGUAGE = {
  'GREETING_TRANSLATION' : {
    'ru' : ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи', '[Введите своё имя]'],
    'ua' : ['Доброго ранку', 'Доброго дня', 'Доброго вечора', 'Доброї ночі', '[Введіть своє ім\'я]'],
    'en' : ['Good morning', 'Good afternoon', 'Good evening', 'Good night', '[Enter your name]'],
    'de' : ['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Gute Nacht', '[Geben Sie Ihren Namen ein]']
  },

  'TIME_ZONE_NAME' : {
    'ru' : 'ru-RU',
    'ua' : 'uk-UA',
    'en' : 'en-US',
    'de' : 'de-De'
  },

  'WEATHER_TITLE' : {
    'ru' : ['Скорость ветра:', 'м/c', 'Влажность:', 'Город ', ' не найден.'],
    'ua' : ['Швідкість вітру:', 'м/c', 'Вологість:', 'Місто ', ' не знайдено.'],
    'en' : ['Wind speed:', 'm/s', 'Humidity:', 'City ', ' not found.'],
    'de' : ['Windgeschwindigkeit:', 'm/s', 'Feuchtigkeit:', 'Die Stadt ', ' wurde nicht gefunden.']
  },

  'CITY_DEFAULT' : {
    'ru' : 'Минск',
    'ua' : 'Мінськ',
    'en' : 'Minsk',
    'de' : 'Minsk'
  }
};


let backgroundNumber = 1;
let language = 'ua';


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

const playButton = document.querySelector('.play');
const playNextButton = document.querySelector('.play-next');
const playPrevButton = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');

const audio = new Audio();
let isPlay = false;
let playNum = 0;

const languageSettings = document.querySelectorAll('.language-item');

//====================== FIRST SETTINGS ======================
setFirstSettings();

function setFirstSettings() {
  showTime();
  setRandomBackgroundNum(1,20);
  setBackground();
  generatePlayList(); 
}

//====================== LOCAL STORAGE ======================
function setLocalStorage() {
  localStorage.setItem('name', nameInput.value);
  localStorage.setItem('city', cityInput.value);
  localStorage.setItem('language', language);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  const nameLocalStorage = localStorage.getItem('name');
  const cityLocalStorage = localStorage.getItem('city');
  const languageLocalStorage = localStorage.getItem('language');
  
  if (languageLocalStorage) {
    language = languageLocalStorage;
    getQuotes();
    languageSettings.forEach(element => {
      element.classList.remove('active');
    });
    document.querySelector(`li[data-language="${language}"]`).classList.add('active');
  } else {
    language = 'en';
    getQuotes();
    languageSettings.forEach(element => {
      element.classList.remove('active');
    });
    document.querySelector(`li[data-language="${language}"]`).classList.add('active');
  }

  if (nameLocalStorage) {
    nameInput.value = nameLocalStorage;
  }

  if (cityLocalStorage) {
    cityInput.value = cityLocalStorage;
    getWeather();
  } else {
    cityInput.value = LOCAL_LANGUAGE.CITY_DEFAULT[language];
    getWeather();
  }
}
window.addEventListener('load', getLocalStorage);

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
  const currentDate = date.toLocaleDateString(`${LOCAL_LANGUAGE.TIME_ZONE_NAME[language]}`, options);
  dateOutput.textContent = currentDate;
}

function getTimeOfDay(){
  const date = new Date();
  const hours = date.getHours();
  
  if (hours >= 0 && hours < 12) return 0;
  
  if (hours >= 12 && hours < 18) return 1;
  
  if (hours >= 18 && hours < 20) return 2;
  
  if (hours >= 20 && hours < 24) return 3;

  return 0;
}

function showGreeting() {
  const numberTime = getTimeOfDay();
  const greetingText = `${LOCAL_LANGUAGE.GREETING_TRANSLATION[language][numberTime]},`;
  greetingOutput.textContent = greetingText;
  nameInput.setAttribute('placeholder', LOCAL_LANGUAGE.GREETING_TRANSLATION[language][4]);
}


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
  const numberTime = getTimeOfDay();

  let backgroundName =  backgroundNumber < 10 ? "0" + backgroundNumber : backgroundNumber;
  const img = new Image();

  img.src = `https://raw.githubusercontent.com/YaroslavaGD/stage1-tasks/assets/images/${TIME_OF_DAY[numberTime]}/${backgroundName}.jpg`;
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
    let city = cityInput.value;
    if (city === 'Мінськ') city = 'Минск';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${language}&appid=a8ac1027e738e7638e87d25781881790&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIconOutput.className = 'weather-icon owf';
    weatherIconOutput.classList.add(`owf-${data.weather[0].id}`);
    temperatureOutput.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescriptionOutput.textContent = data.weather[0].description;
    windOutput.textContent = `${LOCAL_LANGUAGE.WEATHER_TITLE[language][0]} \u00A0${data.wind.speed.toFixed(0)}${LOCAL_LANGUAGE.WEATHER_TITLE[language][1]}`;
    humidityOutput.textContent = `${LOCAL_LANGUAGE.WEATHER_TITLE[language][2]} \u00A0${data.main.humidity}%`;
    weatherErrorOutput.textContent = '';
  } catch (error) {
    weatherErrorOutput.textContent = `${LOCAL_LANGUAGE.WEATHER_TITLE[language][3]} "` + city + `" ${LOCAL_LANGUAGE.WEATHER_TITLE[language][4]}`;
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
  let quotes = "";
  if (language == "ua") quotes = 'dataua.json';
  if (language == "ru") quotes = 'data.json';
  if (language == "en") quotes = 'https://type.fit/api/quotes';
  if (language == "de") quotes = 'datade.json';

  
  const res = await fetch(quotes);
  const data = await res.json();

  const randomNumber = getRandomNum(0, data.length - 1);

  quoteOutput.textContent = '"' + data[randomNumber].text + '"';
  authorOutput.textContent = data[randomNumber].author;
}

changeQuoteButton.addEventListener('click', getQuotes);


//====================== PLAYER ======================
function playAudio() {
  isPlay = true;
  playButton.classList.add('pause');
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  playListContainer.querySelectorAll('.play-item').forEach(element => element.classList.remove('item-active'));
  playListContainer.querySelector(`li[data-number="${playNum}"]`).classList.add('item-active');
  audio.play();
}

function stopAudio() {
  isPlay = false;
  playButton.classList.remove('pause');
  audio.pause();
}

function playStopAudio() {
  if (isPlay) {
    stopAudio();
  } else {
    playAudio();
  }
}
playButton.addEventListener('click', playStopAudio);

function nextPlayNum() {
  if (playNum == playList.length - 1) return 0;
  return playNum + 1;
}

function prevPlayNum() {
  if (playNum == 0) return playList.length - 1;
  return playNum - 1;
}

function playNextAudio() {
  playNum = nextPlayNum();
  playAudio();
}
playNextButton.addEventListener('click', playNextAudio);

function playPrevAudio() {
  playNum = prevPlayNum();
  playAudio();
}
playPrevButton.addEventListener('click', playPrevAudio);

function playThisAudio() {
  playNum = Number(this.getAttribute('data-number'));
  playAudio();
}

function generatePlayList() {
  playList.forEach((element, index) => {
    const li = document.createElement('li');

    li.classList.add('play-item');
    li.textContent = element.title;
    li.setAttribute('data-number', index);

    playListContainer.append(li);
    li.addEventListener('click', playThisAudio);
  });
}

//====================== LANGUAGE =====================

function setLanguage(){
  language = this.getAttribute('data-language');
  languageSettings.forEach(element => {
    element.classList.remove('active');
  });
  this.classList.add('active');

  if ((LOCAL_LANGUAGE.CITY_DEFAULT.ua === cityInput.value) || 
      (LOCAL_LANGUAGE.CITY_DEFAULT.ru === cityInput.value) || 
      (LOCAL_LANGUAGE.CITY_DEFAULT.en === cityInput.value) || 
      (LOCAL_LANGUAGE.CITY_DEFAULT.de === cityInput.value)) {
        cityInput.value = LOCAL_LANGUAGE.CITY_DEFAULT[language];
  }
  getWeather();
  getQuotes();
}

languageSettings.forEach(element => {
  element.addEventListener('click', setLanguage);
});