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

    renderTimeTrackingData(data);
  } catch (error) {
    console.error(`Could not get the data: ${error}`);
  }
}

fetchTimeTrackingData();

function renderTimeTrackingData(data) {
  data.forEach(({ title, timeframes }) => {
    const { daily, weekly, monthly } = timeframes;
    // Add dashes in place of spaces so that title matches with card id.
    const formattedTitleId = title.toLowerCase().replace(/\s+/g, '-');

    cardBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        showStats(title, formattedTitleId, timeframes[btn.id]);
        setActiveButton(event);
      });
    });

    dailyBtn.classList.add('card__btn--active');
    // Populate the cards with daily values when page loads.
    showStats(title, formattedTitleId, daily);
  });
}

function showStats(categoryTitle, categoryTitleId, { current, previous }) {
  const cardTitleElements = document.querySelectorAll('.card__subtitle a');

  cardTitleElements.forEach((cardTitleElement) => {
    if (cardTitleElement.textContent === categoryTitle) {
      const currentHoursElement = document.querySelector(
        `#current-hrs-${categoryTitleId}`
      );
      currentHoursElement.textContent = current;

      const previousHoursElement = document.querySelector(
        `#previous-hrs-${categoryTitleId}`
      );

      previousHoursElement.textContent =
        previous === 1
          ? `Last Week - ${previous}hr`
          : `Last Week - ${previous}hrs`;
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
