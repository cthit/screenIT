const notification = document.getElementById('notification');
const uploadImageDiv = document.getElementById('uploadImageDiv');

const dateInput = document.getElementById('dateInput');

const imagePreviewDiv = document.getElementById('imagePreviewDiv');
const imagePreviewText = document.getElementById('imagePreviewText');
const imageInput = document.getElementById('imageInput');

const uploadImageButton = document.getElementById('uploadImageButton');


const notificationTime = 2.5 * 1000;


function createRandomSuffix(){
    let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    return uniqueSuffix;
}


function uploadImage() {
    const formData = new FormData();
    formData.append('adminKey', adminKey);
    formData.append('image', imageInput.files[0]);
    formData.append('validUntil', dateInput.value);
    formData.append('id', createRandomSuffix());

    fetch('/api/images/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response)
    .then(response => {
        console.log(response.text());

        if (response.status === 200) {
            imageInput.value = '';
            dateInput.value = '';
            imagePreviewText.textContent = 'No file selected';

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

uploadImageButton.addEventListener('click', () => {
    if (dateInput.value === '') { // if the date is empty, notify the user
        notify(notification, "Date is empty", notificationTime, '#961818');
    } else if (new Date(dateInput.value) > new Date()) { // if the date is in the future, upload, else notify the user
        uploadImage();
    } else {
        notify(notification, "Date is in the past", notificationTime, '#961818');
    }
});