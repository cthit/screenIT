const image = document.getElementById('image');
const date = document.getElementById('date');


function uploadImage() {

  const formData = new FormData();
  formData.append('imageData', image.files[0]);
  formData.append('validUntil', date.value);


  fetch('/api/uploadImage', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(message => {
    alert(message);
    // Optionally, you can redirect to another page or update the UI.
  })
  .catch(error => {
    console.error('Error uploading image:', error);
    alert('Error uploading image. Please try again.');
  });
}