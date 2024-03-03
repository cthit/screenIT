const imageContainer = document.getElementById('imageContainer');
const imageCarousel = document.getElementById('imageCarousel');

const settingsDiv = document.getElementById('settingsDiv');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const carouselSpeedInput = document.getElementById('carouselSpeedInput');


const pathToEventImages = '/img/eventImages/';

let currentIndex = 0;
let images = [];

let autoRefreshTime = 10 * 60 * 1000; //time before fetching from the server again (in milliseconds)
let carouselSpeed = 8 * 1000; // time each images is shows before going to the next (in milliseconds)
let timeBeforeHidingMenus = 5 * 1000; //milliseconds

carouselSpeedInput.value = carouselSpeed / 1000;

imageCarousel.onerror = function() {
    console.log("Error loading image:", imageCarousel.src);
    displayNextImage(); 
}


function displayNextImage() {
    const currentImage = images[currentIndex];
    if (images.length === 0) {
        console.log("No images to display");
    } else {
        console.log("Next image")
        imageCarousel.src = pathToEventImages + currentImage.path;
        currentIndex = (currentIndex + 1) % images.length;
    }
}

function continueCarousel() {
    displayNextImage();
    setTimeout(continueCarousel, carouselSpeed);
}


function fetchUpcomingImages() {
    fetch('/api/getFutureImages')
      .then(response => response.json())
      .then(incomingImages => {
            images = incomingImages;
            console.log(images);
            displayNextImage();
      })
          .catch(error => console.error('Error fetching upcoming images:', error));
}



// Automatically refresh the page
setTimeout(fetchUpcomingImages, autoRefreshTime);

// hide optionsMenu after a few seconds
setTimeout(function() {
    const optionsMenu = document.getElementById('optionsMenu');

    optionsMenu.classList.add('invisible')
    settingsDiv.classList.add('invisible')
}, timeBeforeHidingMenus);


[hours, minutes, seconds].forEach(time => {
    time.addEventListener('change', function() {
        autoRefreshTime = hours.value * 60 * 60 * 1000 + minutes.value * 60 * 1000 + seconds.value * 1000;
        if (autoRefreshTime < (10 * 1000)) { 
            autoRefreshTime = 10000; // if less than 10 seconds, set to 10 seconds
        }
        fetchUpcomingImages();
        console.log("Auto refresh time:", autoRefreshTime);
    });
});

carouselSpeedInput. addEventListener('change', function() {
    carouselSpeed = carouselSpeedInput.value * 1000;
    if (carouselSpeed < 1000) {
        carouselSpeed = 1000;
    }
    console.log("Carousel speed:", carouselSpeed);
});

fetchUpcomingImages();
continueCarousel();
