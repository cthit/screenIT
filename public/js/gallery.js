const imageContainer = document.getElementById('imageContainer');
const imageCarousel = document.getElementById('imageCarousel');

const settingsDiv = document.getElementById('settingsDiv');
const carouselSpeedInput = document.getElementById('carouselSpeedInput');
const fetchIntervalInput = document.getElementById('fetchIntervalInput');

const upcomingEventsContainer = document.getElementById('upcomingEventsContainer');
const upcomingEvents = document.getElementById('upcomingEvents');

const pathToEventImages = '/img/eventImages/';
const pathToPlaceHolderImage = 'img/icons/sad.svg';

let currentIndex = 0;
let images = [];

let autoRefreshTime = 10 * 60 * 1000; //time before fetching from the server again (in milliseconds)
let carouselSpeed = 8 * 1000; // time each images is shows before going to the next (in milliseconds)
let timeBeforeHidingMenus = 5 * 1000; //milliseconds
let mouseAutoHideTime = 5 * 1000; // Time until the mosuse is hidden (in milliseconds)


if (localStorage.getItem('carouselSpeed')) {
    carouselSpeed = localStorage.getItem('carouselSpeed');
}
if (localStorage.getItem('autoRefreshTime')) {
    autoRefreshTime = localStorage.getItem('autoRefreshTime');
}


let mouseAutoHideTimer; // Variable to store the mouseAutoHideTime ID
let carouselTimer; // Variable to store the carouselTimer ID
let refreshContentTimer; // Variable to store the refreshContentTimer ID


carouselSpeedInput.value = carouselSpeed / 1000; // Set the defualt load value of the carousel speed input
fetchIntervalInput.value = Math.floor((autoRefreshTime % (60 * 60 * 1000)) / (60 * 1000)); // Set the default load value of the minutes input

imageCarousel.onerror = function() {
    console.log("Error loading image:", imageCarousel.src);
    images.splice(currentIndex, 1);
}


function displayNextImage() {
    const currentImage = images[currentIndex];
    imageCarousel.src = pathToEventImages + currentImage.path;
    currentIndex = (currentIndex + 1) % images.length;
}

function continueCarousel() {
    clearTimeout(carouselTimer);
    if (images.length > 0) {
        displayNextImage();
    } else {
        imageCarousel.src = pathToPlaceHolderImage;
    }
    carouselTimer = setTimeout(continueCarousel, carouselSpeed);
}


function fetchUpcomingImages() {
    fetch('/api/images/getFutureImages')
    .then(response => response.json())
    .then(incomingImages => {
        images = incomingImages;
        continueCarousel();
        populateUpcomingEventsDiv();
    })
    .catch(error => console.error('Error fetching upcoming images:', error));
}




fetchIntervalInput.addEventListener('change', function() {
    autoRefreshTime = fetchIntervalInput.value * 60 * 1000;

    if (autoRefreshTime < 60 * 1000) { 
        autoRefreshTime = 60 * 1000; // if less than 1 min seconds, set to 1 min
    } 
    if (autoRefreshTime < carouselSpeed) {
        autoRefreshTime = carouselSpeed;
    }
    fetchIntervalInput.value = autoRefreshTime / 60000;


    console.log("Auto refresh time:", autoRefreshTime);
    fetchUpcomingImages();
    localStorage.setItem('autoRefreshTime', autoRefreshTime);
});

carouselSpeedInput.addEventListener('change', function() {
    carouselSpeed = carouselSpeedInput.value * 1000;
    if (carouselSpeed < 1000) {
        carouselSpeed = 1000;
    }
    console.log("Carousel speed:", carouselSpeed);
    continueCarousel();
    localStorage.setItem('carouselSpeed', carouselSpeed);
});


function populateUpcomingEventsDiv() {
    let imagesContainsName = false;
    upcomingEvents.innerHTML = '';
    
    images.forEach(image => {
        if (image.eventName) {
            imagesContainsName = true;

            const newEvent = document.createElement('p');
            newEvent.classList.add('upcomingEvent');
            newEvent.textContent = image.date + " - " + image.eventName;
            upcomingEvents.appendChild(newEvent);
        }
    });

    if (imagesContainsName) upcomingEventsContainer.classList.remove('hidden');
    else upcomingEventsContainer.classList.add('hidden');
}




// Automatically refresh the page
function automaticallyFetchImages() {
    clearTimeout(refreshContentTimer);
    fetchUpcomingImages();
    refreshContentTimer = setTimeout(automaticallyFetchImages, autoRefreshTime);
}


automaticallyFetchImages();
continueCarousel();



// Function to hide the cursor
function hideCursor() {
    document.body.style.cursor = 'none';
}

// Function to reset the mouseAutoHideTimer
function resetTimer() {
    // Clear the previous mouseAutoHideTimer
    clearTimeout(mouseAutoHideTimer);

    // Start a new mouseAutoHideTime
    mouseAutoHideTimer = setTimeout(hideCursor, mouseAutoHideTime);
}

// Event listener for mousemove event
document.addEventListener('mousemove', () => {
    // Reset the mouseAutoHideTimer when the mouse moves
    resetTimer();
    document.body.style.cursor = 'default';
});



// hide optionsMenu after a few seconds
function hideMenus() {
    setTimeout(function() {
        const optionsMenu = document.getElementById('optionsMenu');
    
        optionsMenu.classList.add('invisible')
        settingsDiv.classList.add('invisible')
    }, timeBeforeHidingMenus);
}

function showMenus() {

    optionsMenu.classList.remove('invisible')
    settingsDiv.classList.remove('invisible')
}


settingsDiv.addEventListener('mouseenter', function() {
    showMenus();

    settingsDiv.addEventListener('mouseleave', function() {
        settingsDiv.removeEventListener('mouseleave', this);
        hideMenus();
    });
});


// to make sure optionsmenu exists when the event listener is added
setTimeout(() => {
    const optionsMenu = document.getElementById('optionsMenu');

optionsMenu.addEventListener('mouseenter', function() {
    showMenus();
    hideMenus();
});
}, 2000);



// Initial call to reset the mouseAutoHideTimer
resetTimer();
hideMenus();