const imageContainer = document.getElementById('imageContainer');
const imageCarousel = document.getElementById('imageCarousel');
const optionsMenu = document.getElementById('optionsMenu');


const pathToEventImages = '/img/eventImages/';
const autoRefreshTime = 24 * 60 * 60 * 1000; //milliseconds
let currentIndex = 0;
let images = [];


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

        setTimeout(displayNextImage, 5000);
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
setTimeout(function() {optionsMenu.classList.add('invisible')}, 5 * 1000);