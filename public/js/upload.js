const image = document.getElementById('image');
const date = document.getElementById('date');
const notification = document.getElementById('notification');
const uploadImageDiv = document.getElementById('uploadImageDiv');

const notificationTime = 2.5 * 1000;

function uploadImage() {

    const formData = new FormData();
    formData.append('adminKey', adminKey);
    formData.append('image', image.files[0]);
    formData.append('validUntil', date.value);


    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response)
    .then(response => {
        console.log(response.text());

        if (response.status === 200) {
            notify("image uploaded successfully", '#189618');
        } else {
            notify("An error was encountered", '#961818')
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
}

function notify(message, color) {
    console.log(color);

    if (color) {
        notification.style.backgroundColor = color;
    }
    notification.textContent = message;
    notification.classList.add('activeNotification')

    setTimeout(() => {
        notification.textContent = '';
        notification.classList.remove('activeNotification');
    }, notificationTime);
}


// if (isLoggedIn) {
//     console.log('User is logged in');
//     uploadImageDiv.classList.remove('hidden');
// } else {
//     uploadImageDiv.classList.add('hidden');
// }