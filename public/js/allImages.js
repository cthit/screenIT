const imagesDiv = document.getElementById("imagesDiv");

let pathToEventImages = "/img/eventImages/";


fetch("/api/getAllImages")
.then(response => response.json())
.then(incomingImages => {
    incomingImages.forEach(img => {
        imagesDiv.appendChild(createImgDiv(img));
    });
})
.catch(error => console.error("Error fetching upcoming images:", error));   

function createImgDiv(image) {
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("imgDiv");

    const img = document.createElement("img");
    img.src = pathToEventImages + image.path;
    img.classList.add("img")
    imgDiv.appendChild(img);


    const dateP = document.createElement("p");
    dateP.textContent = image.date;
    dateP.classList.add("dateP");
    imgDiv.appendChild(dateP);

    let removeImageButton = createRemoveImageButton(image, imgDiv);
    imgDiv.appendChild(removeImageButton);

    return imgDiv;
}


function createRemoveImageButton(image, imgDiv){
    let removeImageButton = document.createElement("div");
    removeImageButton.classList.add("removeImageButton");
    if (!isLoggedIn){
        removeImageButton.classList.add("hidden");
    }

    let removeImg = document.createElement("img");
    removeImg.src = "../img/icons/remove.svg";
    removeImageButton.appendChild(removeImg);


    removeImageButton.addEventListener("click", () => {
        console.log("Remove image button clicked", adminKey);

        const data = {
            adminKey: adminKey,
            id: image.id
        };
    
        fetch('/api/removeImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                console.log('Image removed successfully!');
                imgDiv.parentNode.removeChild(imgDiv);
            }
            else {
                throw new Error('Network response was not ok');
            }
            return response;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
    return removeImageButton;
}