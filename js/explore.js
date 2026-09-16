// =========================================================
// GET CITY FROM URL
// =========================================================

const params = new URLSearchParams(window.location.search);

const city = params.get("city");

const cityHeading = document.getElementById("cityHeading");
const categoryCards = document.querySelectorAll(".category-card");


// =========================================================
// DISPLAY CITY
// =========================================================

if (!city) {

    cityHeading.textContent = "Please select a city";

} else {

    cityHeading.textContent = `Explore ${city}`;

}


// =========================================================
// CATEGORY CLICK
// =========================================================

categoryCards.forEach(function (card) {

    card.addEventListener("click", function () {

        // If no city was selected
        if (!city) {

            alert("Please select a city first.");

            window.location.href = "index.html#explore";

            return;
        }

        const category = card.dataset.category;

        window.location.href =
            `places.html?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`;

    });

});


// =========================================================
// LOGIN STATE
// =========================================================

const token = localStorage.getItem("snapcityToken");
const savedUser = localStorage.getItem("snapcityUser");

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const logoutButton = document.getElementById("logoutButton");


if (token && savedUser) {

    if (loginLink) {
        loginLink.style.display = "none";
    }

    if (registerLink) {
        registerLink.style.display = "none";
    }

    if (logoutButton) {
        logoutButton.style.display = "inline-block";
    }

}


// =========================================================
// LOGOUT
// =========================================================

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("snapcityToken");
        localStorage.removeItem("snapcityUser");

        window.location.href = "index.html";

    });

}