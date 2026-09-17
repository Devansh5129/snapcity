
// ==========================================
// SNAPCITY PLACES
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const city =
    params.get("city");

const category =
    params.get("category");

const pageHeading =
    document.getElementById(
        "pageHeading"
    );

const pageDescription =
    document.getElementById(
        "pageDescription"
    );

const placesContainer =
    document.getElementById(
        "placesContainer"
    );

const resultsCount =
    document.getElementById(
        "resultsCount"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const areaInput =
    document.getElementById(
        "areaInput"
    );

const minRatingInput =
    document.getElementById(
        "minRatingInput"
    );

const maxPriceInput =
    document.getElementById(
        "maxPriceInput"
    );

const filterButton =
    document.getElementById(
        "filterButton"
    );

const clearFilterButton =
    document.getElementById(
        "clearFilterButton"
    );


// ==========================================
// CATEGORY NAMES
// ==========================================

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


// ==========================================
// DEFAULT IMAGE
// ==========================================

const defaultImage =
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80";


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// CATEGORY NAME
// ==========================================

function getCategoryName(category) {

    if (!category) {
        return "Places";
    }

    return (
        categoryNames[category] ||
        category.charAt(0).toUpperCase() +
        category.slice(1)
    );
}


// ==========================================
// LOAD PLACES
// ==========================================

async function loadPlaces() {

    const search =
        searchInput.value.trim();

    const area =
        areaInput.value.trim();

    const minRating =
        minRatingInput.value.trim();

    const maxPrice =
        maxPriceInput.value.trim();


    const queryParams =
        new URLSearchParams();


    if (city) {

        queryParams.append(
            "city",
            city
        );
    }


    if (category) {

        queryParams.append(
            "category",
            category
        );
    }


    if (search) {

        queryParams.append(
            "search",
            search
        );
    }


    if (area) {

        queryParams.append(
            "area",
            area
        );
    }


    if (minRating) {

        queryParams.append(
            "minRating",
            minRating
        );
    }


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


    placesContainer.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>
                Finding places in
                ${escapeHTML(city || "your city")}...
            </p>
        </div>
    `;


    resultsCount.textContent =
        "Finding places...";


    try {

        const response =
            await fetch(
                `https://snapcity-api.onrender.com/api/places?${queryParams.toString()}`
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


        resultsCount.textContent =
            `${places.length} place${places.length !== 1 ? "s" : ""} found`;


        if (places.length === 0) {

            showEmptyState();

            return;
        }


        renderPlaces(
            places
        );

    } catch (error) {

        console.error(
            "Error loading places:",
            error
        );

        resultsCount.textContent =
            "Unable to load results";

        showErrorState();
    }
}


// ==========================================
// RENDER PLACES
// ==========================================

function renderPlaces(places) {

    placesContainer.innerHTML =
        "";


    places.forEach(
        function (place) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "place-card";


            const priceText =
                place.price !== null &&
                place.price !== undefined &&
                place.price !== ""
                    ? `₹${place.price}`
                    : "Contact for price";


            const image =
                place.image ||
                defaultImage;


            const displayCategory =
                getCategoryName(
                    place.category
                );


            const rating =
                place.rating !== null &&
                place.rating !== undefined &&
                place.rating !== ""
                    ? place.rating
                    : "N/A";


            const address =
                place.address ||
                "Address not available";


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


            // ----------------------------------
            // SAFE VALUES
            // ----------------------------------

            const safeName =
                escapeHTML(
                    place.name ||
                    "Unnamed Place"
                );

            const safeImage =
                escapeHTML(
                    image
                );

            const safeCategory =
                escapeHTML(
                    displayCategory
                );

            const safeRating =
                escapeHTML(
                    rating
                );

            const safeLocation =
                escapeHTML(
                    location
                );

            const safeAddress =
                escapeHTML(
                    address
                );

            const safePrice =
                escapeHTML(
                    priceText
                );


            // ----------------------------------
            // CARD HTML
            // ----------------------------------

            card.innerHTML = `

                <div class="place-card-image-wrapper">

                    <img
                        class="place-card-image"
                        src="${safeImage}"
                        alt="${safeName}"
                        loading="lazy"
                    >

                    <span class="place-category-badge">
                        ${safeCategory}
                    </span>

                </div>


                <div class="place-card-content">

                    <div class="place-card-title-row">

                        <h3>
                            ${safeName}
                        </h3>

                        <span class="place-rating-small">
                            ⭐ ${safeRating}
                        </span>

                    </div>


                    <p class="place-location">
                        📍 ${safeLocation}
                    </p>


                    <p class="place-address">
                        ${safeAddress}
                    </p>


                    <div class="place-card-bottom">

                        <span class="place-price">
                            ${safePrice}
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


            // ----------------------------------
            // IMAGE FALLBACK
            // ----------------------------------

            const cardImage =
                card.querySelector(
                    ".place-card-image"
                );


            cardImage.addEventListener(
                "error",
                function () {

                    if (
                        this.src !==
                        defaultImage
                    ) {

                        this.src =
                            defaultImage;
                    }
                }
            );


            // ----------------------------------
            // VIEW DETAILS
            // ----------------------------------

            const viewDetailsButton =
                card.querySelector(
                    ".view-details"
                );


            viewDetailsButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

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


            // ----------------------------------
            // CARD CLICK
            // ----------------------------------

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


            placesContainer.appendChild(
                card
            );
        }
    );
}


// ==========================================
// EMPTY STATE
// ==========================================

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
                We couldn't find any places
                matching your current filters.
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


// ==========================================
// ERROR STATE
// ==========================================

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
                Please make sure the SnapCity
                server is running and try again.
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


// ==========================================
// CLEAR FILTERS
// ==========================================

function clearFilters() {

    searchInput.value =
        "";

    areaInput.value =
        "";

    minRatingInput.value =
        "";

    maxPriceInput.value =
        "";

    loadPlaces();
}


// ==========================================
// FILTER EVENTS
// ==========================================

filterButton.addEventListener(
    "click",
    loadPlaces
);


clearFilterButton.addEventListener(
    "click",
    clearFilters
);


[
    searchInput,
    areaInput,
    minRatingInput,
    maxPriceInput

].forEach(
    function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    loadPlaces();
                }
            }
        );
    }
);


// ==========================================
// INITIAL PAGE SETUP
// ==========================================

if (
    !city ||
    !category
) {

    pageHeading.textContent =
        "Invalid Search";


    pageDescription.textContent =
        "Please go back and select a city and category.";


    resultsCount.textContent =
        "";


    placesContainer.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                📍
            </div>

            <h3>
                Select a city and category
            </h3>

            <p>
                Go back to SnapCity and choose
                what you are looking for.
            </p>

            <a
                href="index.html#explore"
                class="filter-button"
            >
                Explore SnapCity
            </a>

        </div>
    `;

} else {

    const formattedCategory =
        getCategoryName(
            category
        );


    pageHeading.textContent =
        `${formattedCategory} in ${city}`;


    pageDescription.textContent =
        `Discover ${formattedCategory.toLowerCase()} options available in ${city}.`;


    loadPlaces();
}
