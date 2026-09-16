
// ==========================================
// SNAPCITY HOME PAGE
// ==========================================

const citySelect =
    document.getElementById("citySelect");

const exploreButton =
    document.getElementById("exploreButton");


// ------------------------------------------
// EXPLORE CITY
// ------------------------------------------

if (exploreButton && citySelect) {

    exploreButton.addEventListener(
        "click",
        function () {

            const selectedCity =
                citySelect.value.trim();


            if (selectedCity === "") {

                alert(
                    "Please select a city first."
                );

                return;
            }


            window.location.href =
                `explore.html?city=${encodeURIComponent(
                    selectedCity
                )}`;
        }
    );
}


// ------------------------------------------
// AUTH UI
// ------------------------------------------

const token =
    localStorage.getItem(
        "snapcityToken"
    );

const savedUser =
    localStorage.getItem(
        "snapcityUser"
    );

const loginLink =
    document.getElementById(
        "loginLink"
    );

const registerLink =
    document.getElementById(
        "registerLink"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (
    token &&
    savedUser
) {

    try {

        const user =
            JSON.parse(savedUser);


        if (loginLink) {

            loginLink.style.display =
                "none";
        }


        if (registerLink) {

            registerLink.style.display =
                "none";
        }


        if (logoutButton) {

            logoutButton.style.display =
                "inline-block";
        }


        console.log(
            "Logged in user:",
            user
        );

    } catch (error) {

        console.error(
            "Invalid saved user:",
            error
        );

        localStorage.removeItem(
            "snapcityToken"
        );

        localStorage.removeItem(
            "snapcityUser"
        );
    }
}


// ------------------------------------------
// LOGOUT
// ------------------------------------------

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "snapcityToken"
            );

            localStorage.removeItem(
                "snapcityUser"
            );

            window.location.href =
                "index.html";
        }
    );
}

