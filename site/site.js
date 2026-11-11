const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
  navigation.inert = !open;
}

menuButton.hidden = false;
document.documentElement.classList.add('has-menu');
setMenu(false);
menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') === 'false');
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

document.querySelectorAll('.value-card').forEach((card) => {
  const dialog = document.getElementById(card.getAttribute('aria-controls'));
  card.addEventListener('click', () => dialog.showModal());
});

const featuredTalk = document.querySelector('[data-spotify-embed]');
featuredTalk?.addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();

  const player = document.createElement('iframe');
  player.className = 'story-player';
  player.title = 'Spotify sermon player';
  player.height = '152';
  player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
  player.src = featuredTalk.dataset.spotifyEmbed;
  featuredTalk.replaceWith(player);
  player.focus({ preventScroll: true });
});

const backToTop = document.querySelector('.back-to-top');
const scrollRoot = document.scrollingElement;

function pageScrollPosition() {
  const bottom = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
  return Math.max(0, Math.min(scrollRoot.scrollTop, bottom));
}

let previousScrollPosition = pageScrollPosition();
window.addEventListener('scroll', () => {
  const position = pageScrollPosition();
  if (position === 0 || position !== previousScrollPosition) {
    backToTop.inert = position === 0 || position > previousScrollPosition;
  }
  previousScrollPosition = position;
}, { passive: true });

window.addEventListener('pageshow', () => {
  previousScrollPosition = pageScrollPosition();
  backToTop.inert = true;
});

const timeline = document.querySelector('.timeline-rail');
if (timeline) {
  const timelineControls = document.querySelector('.timeline-controls');
  const [earlier, later] = timelineControls.querySelectorAll('button');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateTimelineControls() {
    const max = timeline.scrollWidth - timeline.clientWidth;
    earlier.setAttribute('aria-disabled', String(timeline.scrollLeft <= 2));
    later.setAttribute('aria-disabled', String(timeline.scrollLeft >= max - 2));
  }

  function moveTimeline(direction) {
    const control = direction < 0 ? earlier : later;
    if (control.getAttribute('aria-disabled') === 'true') return;
    const step = timeline.firstElementChild.getBoundingClientRect().width;
    timeline.scrollBy({ left: direction * step, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }

  timelineControls.hidden = false;
  timelineControls.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button) moveTimeline(Number(button.dataset.direction));
  });
  timeline.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveTimeline(event.key === 'ArrowLeft' ? -1 : 1);
  });
  timeline.addEventListener('scroll', updateTimelineControls, { passive: true });
  new ResizeObserver(updateTimelineControls).observe(timeline);
  updateTimelineControls();
}

const launchAnnouncement = document.querySelector('.launch-announcement');
if (launchAnnouncement) {
  const launchDate = Date.parse(launchAnnouncement.querySelector('time').dateTime);
  const countdown = launchAnnouncement.querySelector('.countdown');
  const firstSunday = document.querySelector('[data-first-sunday]');
  const count = countdown.querySelector('strong');
  const label = countdown.querySelector('span');
  const londonDate = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  function updateCountdown() {
    const date = Object.fromEntries(londonDate.formatToParts(new Date()).map(({ type, value }) => [type, value]));
    const today = Date.UTC(Number(date.year), Number(date.month) - 1, Number(date.day));
    const days = (launchDate - today) / 86_400_000;
    launchAnnouncement.hidden = days < 0;
    firstSunday.hidden = days < 0;
    countdown.hidden = days <= 0;
    if (days > 0) {
      count.textContent = days;
      label.textContent = days === 1 ? 'day to go' : 'days to go';
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 60_000);
}
