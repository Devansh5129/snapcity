
// ==========================================
// SNAPCITY USER REGISTRATION
// ==========================================

const registerForm =
    document.getElementById(
        "registerForm"
    );

const registerMessage =
    document.getElementById(
        "registerMessage"
    );

const registerButton =
    registerForm.querySelector(
        'button[type="submit"]'
    );

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        registerMessage.textContent =
            "Creating account...";

        registerButton.disabled = true;

        try {

            const response =
                await fetch(
                    "https://snapcity-2.onrender.com/api/auth/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password
                        })
                    }
                );

            const result =
                await response.json();

            console.log(
                "Register result:",
                result
            );

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Registration failed"
                );
            }

            registerMessage.textContent =
                "Account created successfully!";

            setTimeout(
                function () {
                    window.location.href =
                        "login.html";
                },
                1000
            );

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            registerMessage.textContent =
                error.message ||
                "Unable to create account.";

            registerButton.disabled = false;
        }
    }
);
