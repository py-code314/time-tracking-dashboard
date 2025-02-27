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
    /* Click link if difference between mousedown and mouseup is less than 200ms,
    else select the text. */
    if (up - down < 200) {
      link.click();
    }
  };
});

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

function handleButtonClick(event, buttonId) {
  event.preventDefault();
  renderTimeTrackingData(buttonId);
}

function showStats(categoryTitle, categoryTitleId, timeframe, buttonId) {
  const cardTitleElements = document.querySelectorAll('.card__title a');
  let foundMatch = false;

  cardTitleElements.forEach((cardTitleElement) => {
    if (cardTitleElement.textContent === categoryTitle) {
      foundMatch = true;

      const currentHoursElement = document.querySelector(
        `#current-hrs-${categoryTitleId}`
      );
      currentHoursElement.textContent = timeframe.current;

      const previousHoursElement = document.querySelector(
        `#previous-hrs-${categoryTitleId}`
      );

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

function setActiveButton(event) {
  event.preventDefault();

  const buttons = cardBtns;
  const selectedButton = event.currentTarget;

  buttons.forEach((button) => {
    button.ariaSelected = false;
    button.classList.remove('btn--active');
  });

  selectedButton.ariaSelected = true;
  selectedButton.classList.add('btn--active');
}

cardBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    handleButtonClick(event, btn.id);
    setActiveButton(event);
    cards[0].focus();
  });
});

dailyBtn.classList.add('btn--active');
renderTimeTrackingData('daily');
