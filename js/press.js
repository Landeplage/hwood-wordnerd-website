(() => {
  const gallery = document.querySelector('.press-gallery');
  if (!gallery) return;

  const language = gallery.querySelector('#screenshot-language');
  const device = gallery.querySelector('#screenshot-device');
  const groups = gallery.querySelectorAll('.press-screenshot-group');
  const status = gallery.querySelector('.press-gallery-status');
  language.value = gallery.dataset.defaultLanguage;

  function updateGallery() {
    for (const group of groups) {
      const selected = group.dataset.language === language.value &&
        group.dataset.device === device.value;
      group.hidden = !selected;
      if (selected) status.textContent = group.querySelector('h3').textContent;
    }
  }

  language.addEventListener('change', updateGallery);
  device.addEventListener('change', updateGallery);
  updateGallery();
  gallery.classList.add('press-gallery--filtered');
  gallery.querySelector('.press-filters').hidden = false;
})();
