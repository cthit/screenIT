const imageContainer = document.getElementById('imageContainer');
const imageCarousel = document.getElementById('imageCarousel');
const optionsMenu = document.getElementById('optionsMenu');

const settingsDiv = document.getElementById('settingsDiv');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const carouselSpeedInput = document.getElementById('carouselSpeedInput');


const pathToEventImages = '/img/eventImages/';

let currentIndex = 0;
let images = [];

let autoRefreshTime = 60 * 1000; //milliseconds
let carouselSpeed = 8 * 1000; //milliseconds
let timeBeforeHidingMenus = 5 * 1000; //milliseconds


imageCarousel.onerror = function() {
    console.log("Error loading image:", imageCarousel.src);
    displayNextImage(); 
}


function displayNextImage() {
    const currentImage = images[currentIndex];
    if (images.length === 0) {
        alert("No images to display");
    } else if (currentImage) {
        console.log("Next image")
        imageCarousel.src = pathToEventImages + currentImage.path;
        currentIndex = (currentIndex + 1) % images.length;

        setTimeout(displayNextImage, carouselSpeed);
    } else {
        images.splice(currentIndex, 1);

        displayNextImage();
    }
}

function fetchUpcomingImages() {
    fetch('/api/getFutureImages')
      .then(response => response.json())
      .then(incomingImages => {
          images = incomingImages;

          displayNextImage();
      })
          .catch(error => console.error('Error fetching upcoming images:', error));
}

fetchUpcomingImages();


// Automatically refresh the page
setTimeout(function() {window.location.reload(true);}, autoRefreshTime);

// hide optionsMenu after a few seconds
setTimeout(function() {
    optionsMenu.classList.add('invisible')
    settingsDiv.classList.add('invisible')
}, timeBeforeHidingMenus);

carouselSpeedInput.value = carouselSpeed / 1000;

[hours, minutes, seconds].forEach(time => {
    time.addEventListener('change', function() {
        autoRefreshTime = hours.value * 60 * 60 * 1000 + minutes.value * 60 * 1000 + seconds.value * 1000;
        if (autoRefreshTime < (10 * 1000)) {
            autoRefreshTime = 10000;
        }
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