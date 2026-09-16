
// ==========================================
// SNAPCITY THEME SYSTEM
// ==========================================

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("snapcityTheme");


// ------------------------------------------
// APPLY SAVED THEME
// ------------------------------------------

if (savedTheme === "dark") {

    document.documentElement.classList.add(
        "dark-theme"
    );

}


// ------------------------------------------
// UPDATE BUTTON
// ------------------------------------------

function updateThemeButton() {

    if (!themeToggle) {
        return;
    }


    const isDark =
        document.documentElement.classList.contains(
            "dark-theme"
        );


    if (isDark) {

        themeToggle.textContent =
            "☀️";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light theme"
        );

        themeToggle.setAttribute(
            "title",
            "Switch to light theme"
        );

    } else {

        themeToggle.textContent =
            "🌙";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark theme"
        );

        themeToggle.setAttribute(
            "title",
            "Switch to dark theme"
        );
    }
}


// ------------------------------------------
// INITIAL BUTTON STATE
// ------------------------------------------

updateThemeButton();


// ------------------------------------------
// TOGGLE THEME
// ------------------------------------------

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            const isDark =
                document.documentElement.classList.contains(
                    "dark-theme"
                );


            if (isDark) {

                document.documentElement.classList.remove(
                    "dark-theme"
                );

                localStorage.setItem(
                    "snapcityTheme",
                    "light"
                );

            } else {

                document.documentElement.classList.add(
                    "dark-theme"
                );

                localStorage.setItem(
                    "snapcityTheme",
                    "dark"
                );
            }


            updateThemeButton();
        }
    );
}
