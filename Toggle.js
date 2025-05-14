
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
    const newTheme = isDark ? "light-theme" : "dark-theme";

    document.body.classList.remove(isDark ? "dark-theme" : "light-theme");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
    themeToggle.textContent = theme === "dark-theme" ? "🌞" : "🌙";
}
