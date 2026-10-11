const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  document.querySelectorAll('[data-category]').forEach(work => { work.hidden = button.dataset.filter !== 'all' && work.dataset.category !== button.dataset.filter; });
}));
