const seasonalThemes = {
  12: { // December
    name: "Winter Holidays",
    className: "theme-december",
  },
  10: { // October
    name: "Halloween",
    className: "theme-halloween",
  },
  2: { // February
    name: "Valentine",
    className: "theme-february",
  }
};

(function applySeasonalTheme() {
  const month = new Date().getMonth() + 1;
  const theme = seasonalThemes[month];
  if (!theme) return;

  const container = document.getElementById('music-player');
  if (container) {
    container.classList.add(theme.className);
  } else {
    document.body.classList.add(theme.className);
  }
})();
