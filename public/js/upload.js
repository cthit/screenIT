const image = document.getElementById('image');
const date = document.getElementById('date');


function uploadImage() {

    const formData = new FormData();
    formData.append('image', image.files[0]);
    formData.append('validUntil', date.value);


    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
    });
}