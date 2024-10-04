// travel_recommendation.js

let travelData = {};

// Fetch the JSON data when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetch("travel_recommendation_api.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            travelData = data;
            console.log("Travel Data Fetched Successfully:", travelData);
            // Initially, do not display any recommendations
            // displayAllRecommendations(); // Commented out to prevent initial display
        })
        .catch(error => console.error("Error fetching data:", error));
});

// Search function triggered by the Search button
function search() {
    const query = document.getElementById("destination").value.toLowerCase().trim();
    const recommendSection = document.getElementById("recommend");
    recommendSection.innerHTML = ""; // Clear previous results

    if (query === "") {
        // Optionally, you can choose to display a message or keep it empty
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Please enter a keyword to search for destinations.";
        recommendSection.appendChild(emptyMessage);
        return;
    }

    // Define keyword variations and map them to categories
    const keywordMap = {
        "beach": ["beach", "beaches"],
        "temple": ["temple", "temples"],
        "country": ["country", "countries"]
        // You can add more categories and their variations here
    };

    let matchedCategories = [];

    // Determine which categories match the search query
    for (const [category, variations] of Object.entries(keywordMap)) {
        if (variations.includes(query)) {
            matchedCategories.push(category);
        }
    }

    // If the query doesn't match any predefined keywords, attempt a general search
    if (matchedCategories.length === 0) {
        // Perform a general search across all categories
        displayGeneralSearchResults(query);
    } else {
        // Display results based on matched categories
        matchedCategories.forEach(category => {
            if (category === "beach") {
                displayBeaches(travelData.beaches);
            } else if (category === "temple") {
                displayTemples(travelData.temples);
            } else if (category === "country") {
                displayCountries(travelData.countries);
            }
        });
    }
}

// Function to handle general search when keyword doesn't match predefined categories
function displayGeneralSearchResults(query) {
    const recommendSection = document.getElementById("recommend");
    let resultsFound = false;

    // Search Countries
    const matchedCountries = travelData.countries.filter(country =>
        country.name.toLowerCase().includes(query)
    );

    if (matchedCountries.length > 0) {
        displayCountries(matchedCountries);
        resultsFound = true;
    }

    // Search Cities within Countries
    let matchedCities = [];
    travelData.countries.forEach(country => {
        const cities = country.cities.filter(city =>
            city.name.toLowerCase().includes(query)
        );
        cities.forEach(city => {
            matchedCities.push({ ...city, country: country.name });
        });
    });

    if (matchedCities.length > 0) {
        displayCities(matchedCities);
        resultsFound = true;
    }

    // Search Temples
    const matchedTemples = travelData.temples.filter(temple =>
        temple.name.toLowerCase().includes(query)
    );

    if (matchedTemples.length > 0) {
        displayTemples(matchedTemples);
        resultsFound = true;
    }

    // Search Beaches
    const matchedBeaches = travelData.beaches.filter(beach =>
        beach.name.toLowerCase().includes(query)
    );

    if (matchedBeaches.length > 0) {
        displayBeaches(matchedBeaches);
        resultsFound = true;
    }

    // If no results found
    if (!resultsFound) {
        const noResult = document.createElement("p");
        noResult.textContent = "No destinations found matching your search.";
        recommendSection.appendChild(noResult);
    }
}

// Function to display Beaches
function displayBeaches(beaches) {
    const recommendSection = document.getElementById("recommend");

    const beachesDiv = document.createElement("div");
    beachesDiv.classList.add("beaches");

    const beachesTitle = document.createElement("h2");
    beachesTitle.textContent = "Beaches";
    beachesDiv.appendChild(beachesTitle);

    beaches.forEach(beach => {
        const beachDiv = document.createElement("div");
        beachDiv.classList.add("beach");

        const beachName = document.createElement("h3");
        beachName.textContent = beach.name;
        beachDiv.appendChild(beachName);

        const beachImg = document.createElement("img");
        beachImg.src = beach.imageUrl;
        beachImg.alt = beach.name;
        beachImg.style.width = "100%"; // Ensure images fit their container
        beachDiv.appendChild(beachImg);

        const beachDesc = document.createElement("p");
        beachDesc.textContent = beach.description;
        beachDiv.appendChild(beachDesc);

        beachesDiv.appendChild(beachDiv);
    });

    recommendSection.appendChild(beachesDiv);
}

// Function to display Temples
function displayTemples(temples) {
    const recommendSection = document.getElementById("recommend");

    const templesDiv = document.createElement("div");
    templesDiv.classList.add("temples");

    const templesTitle = document.createElement("h2");
    templesTitle.textContent = "Temples";
    templesDiv.appendChild(templesTitle);

    temples.forEach(temple => {
        const templeDiv = document.createElement("div");
        templeDiv.classList.add("temple");

        const templeName = document.createElement("h3");
        templeName.textContent = temple.name;
        templeDiv.appendChild(templeName);

        const templeImg = document.createElement("img");
        templeImg.src = temple.imageUrl;
        templeImg.alt = temple.name;
        templeImg.style.width = "100%";
        templeDiv.appendChild(templeImg);

        const templeDesc = document.createElement("p");
        templeDesc.textContent = temple.description;
        templeDiv.appendChild(templeDesc);

        templesDiv.appendChild(templeDiv);
    });

    recommendSection.appendChild(templesDiv);
}

// Function to display Countries
function displayCountries(countries) {
    const recommendSection = document.getElementById("recommend");

    const countriesDiv = document.createElement("div");
    countriesDiv.classList.add("countries");

    const countriesTitle = document.createElement("h2");
    countriesTitle.textContent = "Countries";
    countriesDiv.appendChild(countriesTitle);

    countries.forEach(country => {
        const countryDiv = document.createElement("div");
        countryDiv.classList.add("country");

        const countryName = document.createElement("h3");
        countryName.textContent = country.name;
        countryDiv.appendChild(countryName);

        const countryDesc = document.createElement("p");
        countryDesc.textContent = `Explore cities like ${country.cities.map(city => city.name).join(", ")}.`;
        countryDiv.appendChild(countryDesc);

        countriesDiv.appendChild(countryDiv);
    });

    recommendSection.appendChild(countriesDiv);
}

// Function to display Cities
function displayCities(cities) {
    const recommendSection = document.getElementById("recommend");

    const citiesDiv = document.createElement("div");
    citiesDiv.classList.add("cities");

    const citiesTitle = document.createElement("h2");
    citiesTitle.textContent = "Cities";
    citiesDiv.appendChild(citiesTitle);

    cities.forEach(city => {
        const cityDiv = document.createElement("div");
        cityDiv.classList.add("city");

        const cityName = document.createElement("h3");
        cityName.textContent = city.name;
        cityDiv.appendChild(cityName);

        const cityImg = document.createElement("img");
        cityImg.src = city.imageUrl;
        cityImg.alt = city.name;
        cityImg.style.width = "100%";
        cityDiv.appendChild(cityImg);

        const cityDesc = document.createElement("p");
        cityDesc.textContent = city.description;
        cityDiv.appendChild(cityDesc);

        citiesDiv.appendChild(cityDiv);
    });

    recommendSection.appendChild(citiesDiv);
}

// Clear search function triggered by the Clear button
function clearSearch() {
    document.getElementById("destination").value = ""; // Clear the input field
    const recommendSection = document.getElementById("recommend");
    recommendSection.innerHTML = ""; // Clear displayed results

    // Optionally, display a message indicating that the results have been cleared
    const clearedMessage = document.createElement("p");
    clearedMessage.textContent = "Search results cleared.";
    recommendSection.appendChild(clearedMessage);
}