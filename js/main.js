

const cards = document.querySelectorAll('.card__content');
console.log(cards);

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
