const timeOutput = document.querySelector('.time');
const dateOutput = document.querySelector('.date');
const greetingOutput = document.querySelector('.greeting');
const nameInput = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

const TIME_OF_DAY = ['morning', 'afternoon', 'evening', 'night'];

let backgroundNumber = 1;


showTime();

setRandomBackgroundNum(1,20);
setBackground();

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


function setLocalStorage() {
  localStorage.setItem('name', nameInput.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  const nameLocalStorage = localStorage.getItem('name');
  if (nameLocalStorage) {
    nameInput.value = nameLocalStorage;
  }
}
window.addEventListener('load', getLocalStorage);

function setRandomBackgroundNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  backgroundNumber = Math.floor(Math.random() * (max - min + 1)) + min;
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