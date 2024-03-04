const imageInput = document.getElementById('imageInput');
const date = document.getElementById('date');
const notification = document.getElementById('notification');
const uploadImageDiv = document.getElementById('uploadImageDiv');

const imagePreviewDiv = document.getElementById('imagePreviewDiv');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewText = document.getElementById('imagePreviewText');

const notificationTime = 2.5 * 1000;



function createRandomSuffix(){
    let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    return uniqueSuffix;
}


function uploadImage() {
    const formData = new FormData();
    formData.append('adminKey', adminKey);
    formData.append('image', imageInput.files[0]);
    formData.append('validUntil', date.value);
    formData.append('id', createRandomSuffix());

    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response)
    .then(response => {
        console.log(response.text());

        if (response.status === 200) {
            notify(notification, "image uploaded successfully", notificationTime, '#189618');
        } else {
            notify(notification, "An error was encountered", notificationTime, '#961818')
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
}

imagePreviewDiv.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];

    imagePreviewText.textContent = file.name;
});