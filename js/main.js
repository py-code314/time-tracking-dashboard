const daily = document.querySelector('#daily');
const weekly = document.querySelector('#weekly');
const monthly = document.querySelector('#monthly');

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
    // console.log(data);
    populateDailyStats(data)

   
  } catch (error) {
    console.error(`Could not get the data: ${error}`)
 } 
}

fetchStats()


function populateDailyStats(data) {
 
  data.forEach(category => {
    const { title, timeframes } = category;
    
    const { daily, weekly, monthly } = timeframes
    console.log(daily);
    const titleWithDash = title.split(' ').join('-').toLowerCase()
    console.log(titleWithDash);
    
    Array.from(cardNames).forEach((cardName) => {
      
      if (cardName.textContent === title) {
        const currentHrs = document.querySelector(`#current-hrs-${titleWithDash}`);
        currentHrs.textContent = daily.current;
        const previousHrs = document.querySelector(`#previous-hrs-${titleWithDash}`);
        console.log(previousHrs);
        previousHrs.textContent = daily.previous === 1 ? `Last Week - ${daily.previous}hr` : `Last Week - ${daily.previous}hrs`;
      }
    })

  })
}



