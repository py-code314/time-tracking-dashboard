/* Global Variables */
const cardBtns = Array.from(document.querySelectorAll('.btn--timeframe'));
const cards = Array.from(document.querySelectorAll('.card__content'));
const dailyBtn = document.querySelector('#daily');

/* Function to make whole card clickable & make text within copyable */
cards.forEach((card) => {
  // down & up variables are only initialized, link is assigned to link element.
  let down,
    up,
    link = card.querySelector('.card__title a');

  card.style.cursor = 'pointer';
  // '+' converts Date object into a number.
  card.onmousedown = () => (down = +new Date());
  card.onmouseup = () => {
    up = +new Date();
    // Click link if difference between mousedown and mouseup is less than 200ms,
    // else select the text. 
    if (up - down < 200) {
      link.click();
    }
  };
});

/* Fetches data from data.json and returns it in JSON format */
async function fetchTimeTrackingData() {
  try {
    const response = await fetch('../data.json');

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Could not get the data: ${error}`);
  }
}

  /* Fetches data from data.json and renders it to the DOM based on the active button */
async function renderTimeTrackingData(buttonId) {
  const data = await fetchTimeTrackingData();

  data.forEach(({ title, timeframes }) => {
    const { daily, weekly, monthly } = timeframes;
    // Add dashes in place of spaces so that title matches with card id.
    const formattedTitleId = title.toLowerCase().replace(/\s+/g, '-');
    const timeframe =
      buttonId === 'daily' ? daily : buttonId === 'weekly' ? weekly : monthly;
    showStats(title, formattedTitleId, timeframe, buttonId);
  });
}

/* Handles the click event for time frame buttons and 
renders time tracking data for the selected time frame */
function handleButtonClick(event, buttonId) {
  event.preventDefault();
  renderTimeTrackingData(buttonId);
}

/* Shows the current and previous hours for a given category in the time tracking dashboard */
function showStats(categoryTitle, categoryTitleId, timeframe, buttonId) {
  const cardTitleElements = document.querySelectorAll('.card__title a');
  let foundMatch = false;

  // Loop over each card title element and check if it matches the category title
  cardTitleElements.forEach((cardTitleElement) => {
    if (cardTitleElement.textContent === categoryTitle) {
      // Don't log a message if a match is found
      foundMatch = true;

      const currentHoursElement = document.querySelector(
        `#current-hrs-${categoryTitleId}`
      );
      currentHoursElement.textContent = timeframe.current;

      const previousHoursElement = document.querySelector(
        `#previous-hrs-${categoryTitleId}`
      );

      // Update the previous hours element based on the buttonId
      switch (buttonId) {
        case 'daily':
          previousHoursElement.textContent = `Yesterday - ${
            timeframe.previous
          }hr${timeframe.previous !== 1 ? 's' : ''}`;
          break;
        case 'weekly':
          previousHoursElement.textContent = `Last Week - ${
            timeframe.previous
          }hr${timeframe.previous !== 1 ? 's' : ''}`;
          break;
        case 'monthly':
          previousHoursElement.textContent = `Last Month - ${
            timeframe.previous
          }hr${timeframe.previous !== 1 ? 's' : ''}`;
          break;
        default:
          return;
      }
    }
  });

  if (!foundMatch) {
    console.log('No match found for card title');
  }
}

/* Set the active state of the given button */
function setActiveButton(event) {
  event.preventDefault();

  const buttons = cardBtns;
  const selectedButton = event.currentTarget;

  buttons.forEach((button) => {
    // button.ariaSelected = false;
    button.classList.remove('btn--active');
  });

  // selectedButton.ariaSelected = true;
  selectedButton.classList.add('btn--active');
}

/* Event listeners for the time frame buttons */
cardBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    handleButtonClick(event, btn.id);
    setActiveButton(event);
    cards[0].focus();
  });
});

/* Initial rendering of the time tracking data for the "Daily" time frame */
dailyBtn.classList.add('btn--active');
renderTimeTrackingData('daily');
