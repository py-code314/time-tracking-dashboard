const dailyBtn = document.querySelector('#daily');
const weeklyBtn = document.querySelector('#weekly');
const monthlyBtn = document.querySelector('#monthly');
const cardWork = document.querySelector('.card--work');
const cards = Array.from(document.querySelectorAll('.card__content'));
const cardBtns = Array.from(document.querySelectorAll('.card__btn-duration'));
// console.log(cardBtns);

const cardNames = document.querySelectorAll('.card__subtitle a');

/* Function to make whole card clickable & make text within copyable */
// Array.prototype.forEach.call() is a way to use 'forEach' method on non-array objects.
Array.prototype.forEach.call(cards, (card) => {
  // down & up variables are only initialized, link is assigned to link element.
  let down,
    up,
    link = card.querySelector('.card__subtitle a');
  card.style.cursor = 'pointer';

  card.onmousedown = () => (down = +new Date()); // '+' converts Date object into a number.
  card.onmouseup = () => {
    up = +new Date();
    if (up - down < 200) {
      link.click();
      // console.log('link clicked');
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

// function renderTimeTrackingData(data) {

fetchTimeTrackingData();

function renderTimeTrackingData(data) {
  data.forEach(({ title, timeframes }) => {
    const { daily, weekly, monthly } = timeframes;
    const formattedTitleId = title.toLowerCase().replace(/\s+/g, '-');

    cardBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        showStats(title, formattedTitleId, timeframes[btn.id]);
        updateAriaSelected(event);
        // changeFocusToCard(event)
      });
    });

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

function updateAriaSelected(event) {
  event.preventDefault();
  cardBtns.forEach((button) => {
    button.ariaSelected = false;
    event.currentTarget.ariaSelected = true;
  });
}

cardBtns.forEach((button, buttonIndex) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();

    button.style.color = 'white';
    cards[0].focus();

    function changeFocus(event) {
      if (event.key === 'Tab') {
        event.preventDefault();

        const currentCardIndex = cards.indexOf(document.activeElement);

        if (currentCardIndex === cards.length - 1) {
          const nextButtonIndex = (buttonIndex + 1) % cardBtns.length;

          cardBtns[nextButtonIndex].focus();

          cards.forEach((card) =>
            card.removeEventListener('keydown', changeFocus)
          );
          console.log('Removed keydown event listeners from cards');
        } else {
          cards[currentCardIndex + 1].focus();
        }
      }
    }

    cards.forEach((card) => card.addEventListener('keydown', changeFocus));
  });
});
