// future.js

document.addEventListener('DOMContentLoaded', () => {
  // Fetch future-dated images from the server
  fetch('/getFutureImages')
  .then(response => response.blob())
  .then(images => {
    const imageUrl = URL.createObjectURL(images);
    const img = document.createElement('img');
    img.src = imageUrl;
    document.body.appendChild(img);
  })
  .catch(error => console.error('Error fetching images:', error));

});
