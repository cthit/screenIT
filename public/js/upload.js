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
