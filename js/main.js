const dailyBtn = document.querySelector('#daily');
const weeklyBtn = document.querySelector('#weekly');
const monthlyBtn = document.querySelector('#monthly');

const cards = document.querySelectorAll('.card__content');

const cardNames = document.querySelectorAll('.card__subtitle a');



/* Function to make whole card clickable & make text within copyable */
// Array.prototype.forEach.call() is a way to use 'forEach' method on non-array objects.
Array.prototype.forEach.call(cards, (card) => {
  // down & up variables are only initialized, link is assigned to link element.
  let down,
    up,
    link = card.querySelector('.card__subtitle a');
  card.style.cursor = 'pointer'

  card.onmousedown = () => (down = +new Date()); // '+' converts Date object into a number.
  card.onmouseup = () => {
    up = +new Date();
    if (up - down < 200) {
      link.click();
      console.log('link clicked');
    }
  };
});

async function fetchStats() {
  try {
    const response = await fetch("../data.json")
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
    const data = await response.json()
  
    getDetails(data)

   
  } catch (error) {
    console.error(`Could not get the data: ${error}`)
 } 
}

fetchStats()


function getDetails(data) {
 
  data.forEach(category => {
    const { title, timeframes } = category;
    
    const { daily, weekly, monthly } = timeframes
    console.log(daily);
    const titleId = title.split(' ').join('-').toLowerCase()
    

    dailyBtn.addEventListener('click', () => showDailyStats(title, titleId, daily))

    weeklyBtn.addEventListener('click', () => showWeeklyStats(title, titleId, weekly))

    monthlyBtn.addEventListener('click', () => showMonthlyStats(title, titleId, monthly))

    showDailyStats(title, titleId, daily)
    

  })
}

function showDailyStats(title, titleId, timeframe) {
  Array.from(cardNames).forEach((cardName) => {
    if (cardName.textContent === title) {
      const currentHrs = document.querySelector(
        `#current-hrs-${titleId}`
      );
      currentHrs.textContent = timeframe.current;
      const previousHrs = document.querySelector(
        `#previous-hrs-${titleId}`
      );
      
      previousHrs.textContent =
        timeframe.previous === 1
          ? `Last Week - ${timeframe.previous}hr`
          : `Last Week - ${timeframe.previous}hrs`;
    }
  });
}
function showWeeklyStats(title, titleId, timeframe) {
  Array.from(cardNames).forEach((cardName) => {
    if (cardName.textContent === title) {
      const currentHrs = document.querySelector(
        `#current-hrs-${titleId}`
      );
      currentHrs.textContent = timeframe.current;
      const previousHrs = document.querySelector(
        `#previous-hrs-${titleId}`
      );
      
      previousHrs.textContent =
        timeframe.previous === 1
          ? `Last Week - ${timeframe.previous}hr`
          : `Last Week - ${timeframe.previous}hrs`;
    }
  });
}
function showMonthlyStats(title, titleId, timeframe) {
  Array.from(cardNames).forEach((cardName) => {
    if (cardName.textContent === title) {
      const currentHrs = document.querySelector(
        `#current-hrs-${titleId}`
      );
      currentHrs.textContent = timeframe.current;
      const previousHrs = document.querySelector(
        `#previous-hrs-${titleId}`
      );
      
      previousHrs.textContent =
        timeframe.previous === 1
          ? `Last Week - ${timeframe.previous}hr`
          : `Last Week - ${timeframe.previous}hrs`;
    }
  });
}


