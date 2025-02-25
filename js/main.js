const cardBtns = Array.from(document.querySelectorAll('.card__btn-duration'));
const cards = Array.from(document.querySelectorAll('.card__content'));
const dailyBtn = document.querySelector('#daily');

/* Function to make whole card clickable & make text within copyable */
cards.forEach((card) => {
  // down & up variables are only initialized, link is assigned to link element.
  let down,
    up,
    link = card.querySelector('.card__subtitle a');
  card.style.cursor = 'pointer';

  card.onmousedown = () => (down = +new Date()); // '+' converts Date object into a number.
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
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Could not get the data: ${error}`);
  }
}




async function renderTimeTrackingData(timeframe) {
  const data = await fetchTimeTrackingData();
  data.forEach(({ title, timeframes }) => {
    const { daily, weekly, monthly } = timeframes;
    // Add dashes in place of spaces so that title matches with card id.    
    const formattedTitleId = title.toLowerCase().replace(/\s+/g, '-');
    showStats(
      title,
      formattedTitleId,
      timeframe === 'daily' ? daily : timeframe === 'weekly' ? weekly : monthly
    );
  })
  

  
}
dailyBtn.classList.add('card__btn--active');
renderTimeTrackingData('daily');

async function handleButtonClick(event, buttonId) {
  event.preventDefault();
  renderTimeTrackingData(buttonId);
}

cardBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    handleButtonClick(event, btn.id);
    setActiveButton(event);
  });
});


function showStats(categoryTitle, categoryTitleId, timeframe) {
console.log(timeframe);
 
  const cardTitleElements = document.querySelectorAll('.card__subtitle a');

  cardTitleElements.forEach((cardTitleElement) => {
    

    if (cardTitleElement.textContent === categoryTitle) {
      console.log('matching');
      
      const currentHoursElement = document.querySelector(
        `#current-hrs-${categoryTitleId}`
      );
      console.log(timeframe['current']);
      currentHoursElement.textContent = timeframe.current;

      const previousHoursElement = document.querySelector(
        `#previous-hrs-${categoryTitleId}`
      );
      

      previousHoursElement.textContent = `Last Week - ${timeframe.previous}hr${
        timeframe.previous !== 1 ? 's' : ''}`;
        
    } else {
      console.log('No match found for card title');
    }
  });
}

function setActiveButton(event) {
  event.preventDefault();

  const buttons = cardBtns;
  const selectedButton = event.currentTarget;

  buttons.forEach((button) => {
    button.ariaSelected = false;
    button.classList.remove('card__btn--active');
  });

  selectedButton.ariaSelected = true;
  selectedButton.classList.add('card__btn--active');
}

cardBtns.forEach((button, buttonIndex) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    cards[0].focus(); // Focus goes to first card when a button is clicked.

    function changeFocus(event) {
      if (event.key === 'Tab') {
        event.preventDefault();

        // Get the index of the card that is currently focused.
        const focusedCardIndex = cards.indexOf(document.activeElement);

        if (focusedCardIndex === cards.length - 1) {
          // Change focus to first button if focus is on last card.
          const nextButtonIndex = (buttonIndex + 1) % cardBtns.length;

          cardBtns[nextButtonIndex].focus();

          button.classList.remove('card__btn--active');

          // Remove the keydown event listener from all cards to prevent double click.
          cards.forEach((card) =>
            card.removeEventListener('keydown', changeFocus)
          );
        } else {
          cards[focusedCardIndex + 1].focus();
        }
      }
    }

    cards.forEach((card) => card.addEventListener('keydown', changeFocus));
  });
});
