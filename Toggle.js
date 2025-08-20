const themeToggle = document.getElementById("theme-toggle");

// Apply saved theme on load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.body.classList.add(savedTheme);
    updateThemeButton(savedTheme);
} else {
    document.body.classList.add("light-theme");
    updateThemeButton("light-theme");
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    const isLight = document.body.classList.contains("light-theme");
    const isEaster = document.body.classList.contains("easter-egg");

    // figure out what new theme should be
    let newTheme;
    if (isDark) {
        newTheme = "light-theme";
        document.body.classList.remove("dark-theme");
    } else if (isLight) {
        newTheme = "dark-theme";
        document.body.classList.remove("light-theme");
    } else {
        // fallback (just in case)
        newTheme = "light-theme";
    }

    document.body.classList.add(newTheme);

    // keep easter egg if it was active
    if (isEaster) {
        document.body.classList.add("easter-egg");
    }

    localStorage.setItem("theme", newTheme + (isEaster ? " easter-egg" : ""));
    updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
    themeToggle.textContent = theme === "dark-theme" ? "🌞" : "🌙";
}