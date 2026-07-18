const enterButton = document.querySelector('#enter');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let entering = false;

function enterPortfolio() {
  if (entering) return;
  entering = true;
  document.body.classList.add('transitioning');
  enterButton.setAttribute('aria-disabled', 'true');
  window.setTimeout(() => location.assign('../portfolio/index.html'), reducedMotion.matches ? 80 : 420);
}

enterButton.addEventListener('click', enterPortfolio);
window.addEventListener('keydown', event => {
  if (event.key === 'Enter' && document.activeElement === document.body) enterPortfolio();
});
