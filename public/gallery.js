function fetchUpcomingImages() {
    fetch('/api/getFutureImages')
      .then(response => response.json())
      .then(images => {
        console.log(images[0]);
        
        let currentIndex = 0;
  
        function displayNextImage() {
          const imageContainer = document.getElementById('image-container');
          const currentImage = images[currentIndex];
  
          if (currentImage) {
            // Update the src attribute of the img tag
            console.log("Next image")
            imageContainer.innerHTML = `<img src="/img/${currentImage.path}" alt="Upcoming Image">`;
            currentIndex = (currentIndex + 1) % images.length;
  
            setTimeout(displayNextImage, 5000);
          } else {
            displayNextImage();
          }
        }
  
        displayNextImage();
      })
      .catch(error => console.error('Error fetching upcoming images:', error));
  }
  
  fetchUpcomingImages();
  