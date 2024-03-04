const imagesDiv = document.getElementById("imagesDiv");


let pathToEventImages = "/img/eventImages/";

logInFunctions.push(showRemoveButtons);
logOutFunctions.push(hideRemoveButtons);


fetch("/api/getAllImages")
.then(response => response.json())
.then(incomingImages => {
    populateImagesList(incomingImages);
})
.catch(error => console.error("Error fetching upcoming images:", error));   

function populateImagesList(images) {
    let date = null;
    let datePosters = null;

    images.forEach(img => {
        if (img.date !== date) {
            date = img.date;

            let dateSection = document.createElement("div");
            dateSection.classList.add("dateSection");
        
            let dateP = document.createElement("h2");
            dateP.textContent = date;
            dateSection.appendChild(dateP);

            datePosters = document.createElement("div");
            dateSection.appendChild(datePosters);

            imagesDiv.appendChild(dateSection);
        }
        datePosters.appendChild(createImgDiv(img));
    });
}





function createImgDiv(image) {
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("imgDiv");

    const img = document.createElement("img");
    img.src = pathToEventImages + image.path;
    img.classList.add("img")
    imgDiv.appendChild(img);


    // const dateP = document.createElement("p");
    // dateP.textContent = image.date;
    // dateP.classList.add("dateP");
    // imgDiv.appendChild(dateP);

    let removeImageButton = createRemoveImageButton(image, imgDiv);
    imgDiv.appendChild(removeImageButton);

    return imgDiv;
}



function createRemoveImageButton(image, imgDiv){
    let removeImageButton = document.createElement("div");
    removeImageButton.classList.add("removeImageButton");

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

function showRemoveButtons(){
    let removeButtons = document.getElementsByClassName("removeImageButton");
    for (let i = 0; i < removeButtons.length; i++){
        removeButtons[i].classList.remove("hidden");
    }
}
function hideRemoveButtons(){
    let removeButtons = document.getElementsByClassName("removeImageButton");
    for (let i = 0; i < removeButtons.length; i++){
        removeButtons[i].classList.add("hidden");
    }
}