const timeOutput = document.querySelector('.time');
const dateOutput = document.querySelector('.date');
const greetingOutput = document.querySelector('.greeting');
const nameInput = document.querySelector('.name');

const TIME_OF_DAY = ['morning', 'afternoon', 'evening', 'night'];


showTime();


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
  const greetingText = `Good ${timeOfDay}`;
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

