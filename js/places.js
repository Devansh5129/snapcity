
// =========================================================
// SNAPCITY - PLACES PAGE
// =========================================================


// =========================================================
// GET URL PARAMETERS
// =========================================================

const params = new URLSearchParams(window.location.search);

const city = params.get("city");
const category = params.get("category");


// =========================================================
// PAGE ELEMENTS
// =========================================================

const pageHeading = document.getElementById("pageHeading");

const pageDescription = document.getElementById("pageDescription");

const placesContainer = document.getElementById("placesContainer");

const resultsCount = document.getElementById("resultsCount");


// =========================================================
// FILTER ELEMENTS
// =========================================================

const searchInput = document.getElementById("searchInput");

const areaInput = document.getElementById("areaInput");

const minRatingInput =
    document.getElementById("minRatingInput");

const maxPriceInput =
    document.getElementById("maxPriceInput");

const filterButton =
    document.getElementById("filterButton");

const clearFilterButton =
    document.getElementById("clearFilterButton");


// =========================================================
// CATEGORY DISPLAY NAMES
// =========================================================

const categoryNames = {

    hostel: "Hostels & PGs",

    mess: "Mess & Tiffin",

    restaurant: "Restaurants",

    hospital: "Hospitals",

    clinic: "Clinics",

    temple: "Temples"

};


// =========================================================
// DEFAULT IMAGE
// =========================================================

const defaultImage =
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80";


// =========================================================
// FORMAT CATEGORY NAME
// =========================================================

function getCategoryName(category) {

    if (!category) {

        return "Places";

    }

    return categoryNames[category] ||
        category.charAt(0).toUpperCase() +
        category.slice(1);

}


// =========================================================
// LOAD PLACES
// =========================================================

async function loadPlaces() {

    // -----------------------------------------------------
    // READ FILTER VALUES
    // -----------------------------------------------------

    const search =
        searchInput.value.trim();

    const area =
        areaInput.value.trim();

    const minRating =
        minRatingInput.value.trim();

    const maxPrice =
        maxPriceInput.value.trim();


    // -----------------------------------------------------
    // CREATE QUERY PARAMETERS
    // -----------------------------------------------------

    const queryParams =
        new URLSearchParams();


    // City

    if (city) {

        queryParams.append(
            "city",
            city
        );

    }


    // Category

    if (category) {

        queryParams.append(
            "category",
            category
        );

    }


    // Search

    if (search) {

        queryParams.append(
            "search",
            search
        );

    }


    // Area

    if (area) {

        queryParams.append(
            "area",
            area
        );

    }


    // Minimum Rating

    if (minRating) {

        queryParams.append(
            "minRating",
            minRating
        );

    }


    // Maximum Price

    if (maxPrice) {

        queryParams.append(
            "maxPrice",
            maxPrice
        );

    }


    console.log(
        "SnapCity API Query:",
        queryParams.toString()
    );


    // -----------------------------------------------------
    // LOADING STATE
    // -----------------------------------------------------

    placesContainer.innerHTML = `

        <div class="loading-state">

            <div class="loading-spinner"></div>

            <p>
                Finding places in ${city}...
            </p>

        </div>

    `;


    resultsCount.textContent =
        "Finding places...";


    // -----------------------------------------------------
    // API REQUEST
    // -----------------------------------------------------

    try {
const response = await fetch(
    `https://snapcity-2.onrender.com/api/places?${queryParams.toString()}`
);


        // -------------------------------------------------
        // CHECK RESPONSE
        // -------------------------------------------------

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // -------------------------------------------------
        // CONVERT RESPONSE TO JSON
        // -------------------------------------------------

        const places =
            await response.json();


        console.log(
            "Places received from API:",
            places
        );


        // -------------------------------------------------
        // MAKE SURE RESPONSE IS AN ARRAY
        // -------------------------------------------------

        if (!Array.isArray(places)) {

            throw new Error(
                "API did not return an array"
            );

        }


        // -------------------------------------------------
        // UPDATE RESULT COUNT
        // -------------------------------------------------

        resultsCount.textContent =
            `${places.length} place${places.length !== 1 ? "s" : ""} found`;


        // -------------------------------------------------
        // NO RESULTS
        // -------------------------------------------------

        if (places.length === 0) {

            showEmptyState();

            return;

        }


        // -------------------------------------------------
        // DISPLAY PLACES
        // -------------------------------------------------

        renderPlaces(places);

    }

    catch (error) {

        console.error(
            "Error loading places:",
            error
        );


        resultsCount.textContent =
            "Unable to load results";


        showErrorState();

    }

}


// =========================================================
// RENDER PLACE CARDS
// =========================================================

function renderPlaces(places) {

    placesContainer.innerHTML = "";


    places.forEach(function (place) {

        // -------------------------------------------------
        // CREATE CARD
        // -------------------------------------------------

        const card =
            document.createElement("article");

        card.className =
            "place-card";


        // -------------------------------------------------
        // PRICE
        // -------------------------------------------------

        const priceText =
            place.price !== null &&
            place.price !== undefined
                ? `₹${place.price}`
                : "Contact for price";


        // -------------------------------------------------
        // IMAGE
        // -------------------------------------------------

        const image =
            place.image || defaultImage;


        // -------------------------------------------------
        // CATEGORY
        // -------------------------------------------------

        const displayCategory =
            getCategoryName(place.category);


        // -------------------------------------------------
        // RATING
        // -------------------------------------------------

        const rating =
            place.rating !== null &&
            place.rating !== undefined
                ? place.rating
                : "N/A";


        // -------------------------------------------------
        // ADDRESS
        // -------------------------------------------------

        const address =
            place.address ||
            "Address not available";


        // -------------------------------------------------
        // LOCATION
        // -------------------------------------------------

        let location = "Location not available";


        if (place.area && place.city) {

            location =
                `${place.area}, ${place.city}`;

        }

        else if (place.city) {

            location =
                place.city;

        }

        else if (place.area) {

            location =
                place.area;

        }


        // -------------------------------------------------
        // CARD HTML
        // -------------------------------------------------

        card.innerHTML = `

            <div class="place-card-image-wrapper">

                <img
                    class="place-card-image"
                    src="${image}"
                    alt="${place.name || "SnapCity place"}"
                    loading="lazy"
                >

                <span class="place-category-badge">
                    ${displayCategory}
                </span>

            </div>


            <div class="place-card-content">

                <div class="place-card-title-row">

                    <h3>
                        ${place.name || "Unnamed Place"}
                    </h3>

                    <span class="place-rating-small">
                        ⭐ ${rating}
                    </span>

                </div>


                <p class="place-location">
                    📍 ${location}
                </p>


                <p class="place-address">
                    ${address}
                </p>


                <div class="place-card-bottom">

                    <span class="place-price">
                        ${priceText}
                    </span>


                    <button
                        class="view-details"
                        type="button"
                    >
                        View Details →
                    </button>

                </div>

            </div>

        `;


        // -------------------------------------------------
        // IMAGE ERROR HANDLING
        // -------------------------------------------------

        const cardImage =
            card.querySelector(".place-card-image");


        cardImage.addEventListener(
            "error",
            function () {

                this.src = defaultImage;

            }
        );


        // -------------------------------------------------
        // CARD CLICK
        // -------------------------------------------------

        card.addEventListener(
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
                    `place.html?id=${encodeURIComponent(place._id)}`;

            }
        );


        // -------------------------------------------------
        // ADD CARD TO PAGE
        // -------------------------------------------------

        placesContainer.appendChild(card);

    });

}


// =========================================================
// EMPTY STATE
// =========================================================

function showEmptyState() {

    placesContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                🔎
            </div>

            <h3>
                No places found
            </h3>

            <p>
                We couldn't find any places matching
                your current filters.
            </p>

            <button
                id="emptyClearButton"
                class="filter-button"
                type="button"
            >
                Clear Filters
            </button>

        </div>

    `;


    const emptyClearButton =
        document.getElementById(
            "emptyClearButton"
        );


    emptyClearButton.addEventListener(
        "click",
        clearFilters
    );

}


// =========================================================
// ERROR STATE
// =========================================================

function showErrorState() {

    placesContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                ⚠️
            </div>

            <h3>
                Unable to load places
            </h3>

            <p>
                Please make sure the SnapCity server
                is running and try again.
            </p>

            <button
                id="retryButton"
                class="filter-button"
                type="button"
            >
                Try Again
            </button>

        </div>

    `;


    const retryButton =
        document.getElementById(
            "retryButton"
        );


    retryButton.addEventListener(
        "click",
        loadPlaces
    );

}


// =========================================================
// CLEAR FILTERS
// =========================================================

function clearFilters() {

    searchInput.value = "";

    areaInput.value = "";

    minRatingInput.value = "";

    maxPriceInput.value = "";


    loadPlaces();

}


// =========================================================
// APPLY FILTER BUTTON
// =========================================================

filterButton.addEventListener(
    "click",
    loadPlaces
);


// =========================================================
// CLEAR FILTER BUTTON
// =========================================================

clearFilterButton.addEventListener(
    "click",
    clearFilters
);


// =========================================================
// ENTER KEY SUPPORT
// =========================================================

[
    searchInput,
    areaInput,
    minRatingInput,
    maxPriceInput

].forEach(function (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                loadPlaces();

            }

        }
    );

});


// =========================================================
// INITIAL PAGE SETUP
// =========================================================

if (!city || !category) {

    pageHeading.textContent =
        "Invalid Search";


    pageDescription.textContent =
        "Please go back and select a city and category.";


    resultsCount.textContent = "";


    placesContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                📍
            </div>

            <h3>
                Select a city and category
            </h3>

            <p>
                Go back to SnapCity and choose what
                you are looking for.
            </p>

            <a
                href="index.html#explore"
                class="filter-button"
            >
                Explore SnapCity
            </a>

        </div>

    `;

}

else {

    const formattedCategory =
        getCategoryName(category);


    pageHeading.textContent =
        `${formattedCategory} in ${city}`;


    pageDescription.textContent =
        `Discover ${formattedCategory.toLowerCase()} options available in ${city}.`;


    loadPlaces();

}
