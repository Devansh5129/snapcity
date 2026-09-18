
// ==========================================
// SNAPCITY ADMIN DASHBOARD
// ==========================================

// ------------------------------------------
// AUTHENTICATION CHECK
// ------------------------------------------

const token =
    localStorage.getItem("snapcityToken");

const savedUser =
    localStorage.getItem("snapcityUser");

if (!token || !savedUser) {
    window.location.href = "login.html";
    throw new Error("Authentication required");
}

let currentUser;

try {
    currentUser =
        JSON.parse(savedUser);
} catch (error) {
    console.error(
        "Invalid saved user data:",
        error
    );

    localStorage.removeItem("snapcityToken");
    localStorage.removeItem("snapcityUser");

    window.location.href = "login.html";

    throw new Error(
        "Invalid user session"
    );
}

if (
    !currentUser ||
    currentUser.role !== "admin"
) {
    window.location.href = "index.html";
    throw new Error("Admin access required");
}


// ------------------------------------------
// DOM ELEMENTS
// ------------------------------------------

const adminName =
    document.getElementById(
        "adminName"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const totalPlaces =
    document.getElementById(
        "totalPlaces"
    );

const totalHostels =
    document.getElementById(
        "totalHostels"
    );

const totalRestaurants =
    document.getElementById(
        "totalRestaurants"
    );

const totalHospitals =
    document.getElementById(
        "totalHospitals"
    );

const placeForm =
    document.getElementById(
        "placeForm"
    );

const formTitle =
    document.getElementById(
        "formTitle"
    );

const placeId =
    document.getElementById(
        "placeId"
    );

const placeName =
    document.getElementById(
        "placeName"
    );

const placeCity =
    document.getElementById(
        "placeCity"
    );

const placeCategory =
    document.getElementById(
        "placeCategory"
    );

const placeArea =
    document.getElementById(
        "placeArea"
    );

const placeAddress =
    document.getElementById(
        "placeAddress"
    );

const placePrice =
    document.getElementById(
        "placePrice"
    );

const placeRating =
    document.getElementById(
        "placeRating"
    );

const placePhone =
    document.getElementById(
        "placePhone"
    );

const placeImage =
    document.getElementById(
        "placeImage"
    );

const placeDescription =
    document.getElementById(
        "placeDescription"
    );

const placeFacilities =
    document.getElementById(
        "placeFacilities"
    );

const placeLatitude =
    document.getElementById(
        "placeLatitude"
    );

const placeLongitude =
    document.getElementById(
        "placeLongitude"
    );

const savePlaceButton =
    document.getElementById(
        "savePlaceButton"
    );

const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );

const adminSearchInput =
    document.getElementById(
        "adminSearchInput"
    );

const adminCategoryFilter =
    document.getElementById(
        "adminCategoryFilter"
    );

const adminCityFilter =
    document.getElementById(
        "adminCityFilter"
    );

const clearAdminFilters =
    document.getElementById(
        "clearAdminFilters"
    );

const adminResultsCount =
    document.getElementById(
        "adminResultsCount"
    );

const adminPlacesContainer =
    document.getElementById(
        "adminPlacesContainer"
    );


// ------------------------------------------
// STATE
// ------------------------------------------

let allPlaces = [];

let editingPlaceId = null;


// ------------------------------------------
// SECURITY HELPER
// ------------------------------------------

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ------------------------------------------
// AUTH HEADERS
// ------------------------------------------

function getAuthHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
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
                "login.html";
        }
    );
}


// ------------------------------------------
// DISPLAY ADMIN NAME
// ------------------------------------------

if (adminName) {

    adminName.textContent =
        currentUser.name ||
        "Admin";
}


// ------------------------------------------
// LOAD ALL PLACES
// ------------------------------------------

async function loadPlaces() {

    adminPlacesContainer.innerHTML = `
        <div class="admin-loading-state">
            <div class="loading-spinner"></div>
            <p>Loading places...</p>
        </div>
    `;

    adminResultsCount.textContent =
        "Loading places...";

    try {

        const response =
            await fetch(
                "https://snapcity-2.onrender.com/api/places"
            );

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }

        const places =
            await response.json();

        if (!Array.isArray(places)) {

            throw new Error(
                "API did not return an array"
            );
        }

        allPlaces = places;

        updateStatistics();

        populateCityFilter();

        displayPlaces(
            getFilteredPlaces()
        );

    } catch (error) {

        console.error(
            "Error loading places:",
            error
        );

        adminResultsCount.textContent =
            "Unable to load places";

        showAdminError();
    }
}


// ------------------------------------------
// UPDATE STATISTICS
// ------------------------------------------

function updateStatistics() {

    const hostels =
        allPlaces.filter(
            function (place) {
                return (
                    place.category ===
                    "hostel"
                );
            }
        ).length;

    const restaurants =
        allPlaces.filter(
            function (place) {
                return (
                    place.category ===
                    "restaurant"
                );
            }
        ).length;

    const hospitals =
        allPlaces.filter(
            function (place) {
                return (
                    place.category ===
                    "hospital"
                );
            }
        ).length;


    totalPlaces.textContent =
        allPlaces.length;

    totalHostels.textContent =
        hostels;

    totalRestaurants.textContent =
        restaurants;

    totalHospitals.textContent =
        hospitals;
}


// ------------------------------------------
// POPULATE CITY FILTER
// ------------------------------------------

function populateCityFilter() {

    if (!adminCityFilter) return;

    const currentValue =
        adminCityFilter.value;

    const cities = [
        ...new Set(
            allPlaces
                .map(function (place) {
                    return place.city;
                })
                .filter(function (city) {
                    return city;
                })
        )
    ].sort();

    adminCityFilter.innerHTML =
        `<option value="">All Cities</option>`;

    cities.forEach(
        function (city) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = city;

            option.textContent = city;

            adminCityFilter.appendChild(
                option
            );
        }
    );

    if (
        cities.includes(
            currentValue
        )
    ) {
        adminCityFilter.value =
            currentValue;
    }
}


// ------------------------------------------
// FILTER PLACES
// ------------------------------------------

function getFilteredPlaces() {

    const search =
        adminSearchInput
            ? adminSearchInput.value
                .trim()
                .toLowerCase()
            : "";

    const category =
        adminCategoryFilter
            ? adminCategoryFilter.value
            : "";

    const city =
        adminCityFilter
            ? adminCityFilter.value
            : "";


    return allPlaces.filter(
        function (place) {

            const name =
                String(
                    place.name || ""
                ).toLowerCase();

            const area =
                String(
                    place.area || ""
                ).toLowerCase();

            const address =
                String(
                    place.address || ""
                ).toLowerCase();

            const placeCity =
                String(
                    place.city || ""
                ).toLowerCase();


            const matchesSearch =
                !search ||
                name.includes(search) ||
                area.includes(search) ||
                address.includes(search) ||
                placeCity.includes(search);


            const matchesCategory =
                !category ||
                place.category ===
                    category;


            const matchesCity =
                !city ||
                place.city ===
                    city;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesCity
            );
        }
    );
}


// ------------------------------------------
// DISPLAY PLACES
// ------------------------------------------

function displayPlaces(places) {

    adminResultsCount.textContent =
        `${places.length} place${
            places.length !== 1
                ? "s"
                : ""
        } found`;


    if (places.length === 0) {

        showAdminEmptyState();

        return;
    }


    adminPlacesContainer.innerHTML =
        "";


    places.forEach(
        function (place) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "admin-place-card";


            const category =
                getCategoryName(
                    place.category
                );


            const rating =
                place.rating !== null &&
                place.rating !== undefined &&
                place.rating !== ""
                    ? place.rating
                    : "N/A";


            const price =
                place.price !== null &&
                place.price !== undefined &&
                place.price !== ""
                    ? `₹${place.price}`
                    : "Contact for price";


            let location =
                "Location not available";


            if (
                place.area &&
                place.city
            ) {

                location =
                    `${place.area}, ${place.city}`;

            } else if (place.city) {

                location =
                    place.city;

            } else if (place.area) {

                location =
                    place.area;
            }


            const image =
                place.image ||
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80";


            // --------------------------------
            // SECURITY:
            // Escape all database values
            // before placing them inside innerHTML.
            // --------------------------------

            const safeName =
                escapeHTML(
                    place.name ||
                    "Unnamed Place"
                );

            const safeCategory =
                escapeHTML(
                    category
                );

            const safeRating =
                escapeHTML(
                    rating
                );

            const safePrice =
                escapeHTML(
                    price
                );

            const safeLocation =
                escapeHTML(
                    location
                );

            const safeAddress =
                escapeHTML(
                    place.address ||
                    "Address not available"
                );

            const safePhone =
                escapeHTML(
                    place.phone ||
                    "No phone"
                );

            const safeImage =
                escapeHTML(
                    image
                );


            card.innerHTML = `
                <div class="admin-place-image-wrapper">

                    <img
                        src="${safeImage}"
                        alt="${safeName}"
                        class="admin-place-image"
                        loading="lazy"
                    >

                    <span class="admin-place-category">
                        ${safeCategory}
                    </span>

                </div>


                <div class="admin-place-content">

                    <div class="admin-place-header">

                        <div>

                            <h3>
                                ${safeName}
                            </h3>

                            <p class="admin-place-location">
                                📍 ${safeLocation}
                            </p>

                        </div>

                        <span class="admin-place-rating">
                            ⭐ ${safeRating}
                        </span>

                    </div>


                    <p class="admin-place-address">
                        ${safeAddress}
                    </p>


                    <div class="admin-place-meta">

                        <span>
                            💰 ${safePrice}
                        </span>

                        <span>
                            📞 ${safePhone}
                        </span>

                    </div>


                    <div class="admin-place-actions">

                        <button
                            type="button"
                            class="admin-view-button"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            class="admin-edit-button"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="admin-delete-button"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;


            // --------------------------------
            // IMAGE FALLBACK
            // --------------------------------

            const cardImage =
                card.querySelector(
                    ".admin-place-image"
                );


            if (cardImage) {

                cardImage.addEventListener(
                    "error",
                    function () {

                        if (
                            this.src !==
                            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80"
                        ) {

                            this.src =
                                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80";
                        }
                    }
                );
            }


            // --------------------------------
            // VIEW BUTTON
            // --------------------------------

            const viewButton =
                card.querySelector(
                    ".admin-view-button"
                );


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function () {

                        if (!place._id) {

                            console.error(
                                "Place ID missing:",
                                place
                            );

                            return;
                        }

                        window.location.href =
                            `place.html?id=${encodeURIComponent(
                                place._id
                            )}`;
                    }
                );
            }


            // --------------------------------
            // EDIT BUTTON
            // --------------------------------

            const editButton =
                card.querySelector(
                    ".admin-edit-button"
                );


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    function () {

                        editPlace(
                            place
                        );
                    }
                );
            }


            // --------------------------------
            // DELETE BUTTON
            // --------------------------------

            const deleteButton =
                card.querySelector(
                    ".admin-delete-button"
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    function () {

                        deletePlace(
                            place
                        );
                    }
                );
            }


            adminPlacesContainer
                .appendChild(card);
        }
    );
}


// ------------------------------------------
// CATEGORY NAME
// ------------------------------------------

function getCategoryName(
    category
) {

    const categoryNames = {

        hostel:
            "Hostels & PGs",

        mess:
            "Mess & Tiffin",

        restaurant:
            "Restaurants",

        hospital:
            "Hospitals",

        clinic:
            "Clinics",

        temple:
            "Temples"
    };


    if (!category) {
        return "Place";
    }


    return (
        categoryNames[category] ||
        category
            .charAt(0)
            .toUpperCase() +
        category.slice(1)
    );
}


// ------------------------------------------
// EDIT PLACE
// ------------------------------------------

function editPlace(place) {

    if (!place || !place._id) {

        console.error(
            "Invalid place:",
            place
        );

        return;
    }


    editingPlaceId =
        place._id;


    placeId.value =
        place._id;


    placeName.value =
        place.name || "";


    placeCity.value =
        place.city || "";


    placeCategory.value =
        place.category || "";


    placeArea.value =
        place.area || "";


    placeAddress.value =
        place.address || "";


    placePrice.value =
        place.price !== null &&
        place.price !== undefined
            ? place.price
            : "";


    placeRating.value =
        place.rating !== null &&
        place.rating !== undefined
            ? place.rating
            : "";


    placePhone.value =
        place.phone || "";


    placeImage.value =
        place.image || "";


    placeDescription.value =
        place.description || "";


    placeFacilities.value =
        Array.isArray(
            place.facilities
        )
            ? place.facilities.join(", ")
            : "";


    placeLatitude.value =
        place.latitude !== null &&
        place.latitude !== undefined
            ? place.latitude
            : "";


    placeLongitude.value =
        place.longitude !== null &&
        place.longitude !== undefined
            ? place.longitude
            : "";


    formTitle.textContent =
        "Edit Place";


    savePlaceButton.textContent =
        "Update Place";


    cancelEditButton.style.display =
        "inline-flex";


    formMessage.textContent =
        "Editing selected place.";


    // Scroll to form
    placeForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ------------------------------------------
// RESET FORM
// ------------------------------------------

function resetForm() {

    placeForm.reset();


    placeId.value = "";


    editingPlaceId = null;


    formTitle.textContent =
        "Add New Place";


    savePlaceButton.textContent =
        "Save Place";


    cancelEditButton.style.display =
        "none";


    formMessage.textContent =
        "";
}


// ------------------------------------------
// CANCEL EDIT
// ------------------------------------------

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        function () {

            resetForm();
        }
    );
}


// ------------------------------------------
// CREATE / UPDATE PLACE
// ------------------------------------------

if (placeForm) {

    placeForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // --------------------------------
            // READ FORM VALUES
            // --------------------------------

            const name =
                placeName.value.trim();

            const city =
                placeCity.value.trim();

            const category =
                placeCategory.value
                    .trim()
                    .toLowerCase();

            const area =
                placeArea.value.trim();

            const address =
                placeAddress.value.trim();

            const phone =
                placePhone.value.trim();

            const description =
                placeDescription.value
                    .trim();

            const image =
                placeImage.value.trim();

            const facilities =
                placeFacilities.value
                    .split(",")
                    .map(
                        function (item) {
                            return item.trim();
                        }
                    )
                    .filter(
                        function (item) {
                            return item !== "";
                        }
                    );


            const price =
                placePrice.value.trim();

            const rating =
                placeRating.value.trim();

            const latitude =
                placeLatitude.value.trim();

            const longitude =
                placeLongitude.value.trim();


            // --------------------------------
            // BASIC FRONTEND VALIDATION
            // --------------------------------

            if (
                !name ||
                !city ||
                !category ||
                !area ||
                !address ||
                !phone ||
                !description
            ) {

                formMessage.textContent =
                    "Please fill all required fields.";

                return;
            }


            if (name.length < 2) {

                formMessage.textContent =
                    "Place name must contain at least 2 characters.";

                return;
            }


            if (category !== "hostel" &&
                category !== "mess" &&
                category !== "restaurant" &&
                category !== "hospital" &&
                category !== "clinic" &&
                category !== "temple"
            ) {

                formMessage.textContent =
                    "Please select a valid category.";

                return;
            }


            if (
                rating !== "" &&
                (
                    Number.isNaN(
                        Number(rating)
                    ) ||
                    Number(rating) < 0 ||
                    Number(rating) > 5
                )
            ) {

                formMessage.textContent =
                    "Rating must be between 0 and 5.";

                return;
            }


            if (
                price !== "" &&
                (
                    Number.isNaN(
                        Number(price)
                    ) ||
                    Number(price) < 0
                )
            ) {

                formMessage.textContent =
                    "Price must be a valid positive number.";

                return;
            }


            if (
                latitude !== "" &&
                (
                    Number.isNaN(
                        Number(latitude)
                    ) ||
                    Number(latitude) < -90 ||
                    Number(latitude) > 90
                )
            ) {

                formMessage.textContent =
                    "Latitude must be between -90 and 90.";

                return;
            }


            if (
                longitude !== "" &&
                (
                    Number.isNaN(
                        Number(longitude)
                    ) ||
                    Number(longitude) < -180 ||
                    Number(longitude) > 180
                )
            ) {

                formMessage.textContent =
                    "Longitude must be between -180 and 180.";

                return;
            }


            // --------------------------------
            // REQUEST DATA
            // --------------------------------

            const placeData = {

                name: name,

                city: city,

                category: category,

                area: area,

                address: address,

                phone: phone,

                description:
                    description,

                price:
                    price === ""
                        ? null
                        : Number(price),

                rating:
                    rating === ""
                        ? null
                        : Number(rating),

                image: image,

                facilities:
                    facilities,

                latitude:
                    latitude === ""
                        ? null
                        : Number(latitude),

                longitude:
                    longitude === ""
                        ? null
                        : Number(longitude)
            };


            // --------------------------------
            // BUTTON STATE
            // --------------------------------

            savePlaceButton.disabled =
                true;


            savePlaceButton.textContent =
                editingPlaceId
                    ? "Updating..."
                    : "Saving...";


            formMessage.textContent =
                editingPlaceId
                    ? "Updating place..."
                    : "Saving place...";


            try {

                let response;


                // --------------------------------
                // UPDATE
                // --------------------------------

                if (editingPlaceId) {

                    response =
                        await fetch(
                            `https://snapcity-2.onrender.com/api/places/${encodeURIComponent(
                                editingPlaceId
                            )}`,
                            {
                                method: "PUT",
                                headers:
                                    getAuthHeaders(),
                                body:
                                    JSON.stringify(
                                        placeData
                                    )
                            }
                        );

                }

                // --------------------------------
                // CREATE
                // --------------------------------

                else {

                    response =
                        await fetch(
                            "https://snapcity-2.onrender.com/api/places",
                            {
                                method: "POST",
                                headers:
                                    getAuthHeaders(),
                                body:
                                    JSON.stringify(
                                        placeData
                                    )
                            }
                        );
                }


                const result =
                    await response.json();


                console.log(
                    "Save place result:",
                    result
                );


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "Unable to save place"
                    );
                }


                formMessage.textContent =
                    editingPlaceId
                        ? "Place updated successfully!"
                        : "Place created successfully!";


                resetForm();


                await loadPlaces();


            } catch (error) {

                console.error(
                    "Save place error:",
                    error
                );


                formMessage.textContent =
                    error.message ||
                    "Unable to save place.";


            } finally {

                savePlaceButton.disabled =
                    false;


                savePlaceButton.textContent =
                    editingPlaceId
                        ? "Update Place"
                        : "Save Place";
            }
        }
    );
}


// ------------------------------------------
// DELETE PLACE
// ------------------------------------------

async function deletePlace(place) {

    if (
        !place ||
        !place._id
    ) {

        console.error(
            "Invalid place:",
            place
        );

        return;
    }


    const placeNameForConfirm =
        place.name ||
        "this place";


    const confirmed =
        window.confirm(
            `Are you sure you want to delete "${placeNameForConfirm}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://snapcity-2.onrender.com/api/places/${encodeURIComponent(
                    place._id
                )}`,
                {
                    method: "DELETE",
                    headers:
                        getAuthHeaders()
                }
            );


        const result =
            await response.json();


        console.log(
            "Delete result:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Unable to delete place"
            );
        }


        formMessage.textContent =
            "Place deleted successfully.";


        // If deleted place was
        // currently being edited,
        // clear the form.

        if (
            editingPlaceId ===
            place._id
        ) {

            resetForm();
        }


        await loadPlaces();


    } catch (error) {

        console.error(
            "Delete place error:",
            error
        );


        formMessage.textContent =
            error.message ||
            "Unable to delete place.";
    }
}


// ------------------------------------------
// EMPTY STATE
// ------------------------------------------

function showAdminEmptyState() {

    adminPlacesContainer.innerHTML = `
        <div class="admin-empty-state">

            <div class="admin-empty-icon">
                🔎
            </div>

            <h3>
                No places found
            </h3>

            <p>
                No places match your current
                search or filters.
            </p>

        </div>
    `;
}


// ------------------------------------------
// ERROR STATE
// ------------------------------------------

function showAdminError() {

    adminPlacesContainer.innerHTML = `
        <div class="admin-empty-state">

            <div class="admin-empty-icon">
                ⚠️
            </div>

            <h3>
                Unable to load places
            </h3>

            <p>
                Please make sure the SnapCity
                server is running and try again.
            </p>

            <button
                type="button"
                id="adminRetryButton"
                class="admin-primary-button"
            >
                Try Again
            </button>

        </div>
    `;


    const retryButton =
        document.getElementById(
            "adminRetryButton"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadPlaces
        );
    }
}


// ------------------------------------------
// SEARCH FILTER
// ------------------------------------------

if (adminSearchInput) {

    adminSearchInput.addEventListener(
        "input",
        function () {

            displayPlaces(
                getFilteredPlaces()
            );
        }
    );


    adminSearchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                displayPlaces(
                    getFilteredPlaces()
                );
            }
        }
    );
}


// ------------------------------------------
// CATEGORY FILTER
// ------------------------------------------

if (adminCategoryFilter) {

    adminCategoryFilter.addEventListener(
        "change",
        function () {

            displayPlaces(
                getFilteredPlaces()
            );
        }
    );
}


// ------------------------------------------
// CITY FILTER
// ------------------------------------------

if (adminCityFilter) {

    adminCityFilter.addEventListener(
        "change",
        function () {

            displayPlaces(
                getFilteredPlaces()
            );
        }
    );
}


// ------------------------------------------
// CLEAR ADMIN FILTERS
// ------------------------------------------

if (clearAdminFilters) {

    clearAdminFilters.addEventListener(
        "click",
        function () {

            if (adminSearchInput) {
                adminSearchInput.value =
                    "";
            }

            if (adminCategoryFilter) {
                adminCategoryFilter.value =
                    "";
            }

            if (adminCityFilter) {
                adminCityFilter.value =
                    "";
            }


            displayPlaces(
                getFilteredPlaces()
            );
        }
    );
}


// ------------------------------------------
// INITIAL LOAD
// ------------------------------------------

loadPlaces();
