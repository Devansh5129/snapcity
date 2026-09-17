
// ==========================================
// SNAPCITY LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const loginButton =
    loginForm.querySelector(
        'button[type="submit"]'
    );

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        loginMessage.textContent =
            "Logging in...";

        loginButton.disabled = true;

        try {

            const response =
                await fetch(
                    "https://snapcity-api.onrender.com//api/auth/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );

            const result =
                await response.json();

            console.log(
                "Login result:",
                result
            );

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Login failed"
                );
            }

            localStorage.setItem(
                "snapcityToken",
                result.token
            );

            localStorage.setItem(
                "snapcityUser",
                JSON.stringify(result.user)
            );

            loginMessage.textContent =
                "Login successful!";

            setTimeout(
                function () {

                    if (
                        result.user.role ===
                        "admin"
                    ) {

                        window.location.href =
                            "admin.html";

                    } else {

                        window.location.href =
                            "index.html";

                    }

                },
                500
            );

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                error.message ||
                "Unable to login.";

            loginButton.disabled = false;
        }
    }
);
