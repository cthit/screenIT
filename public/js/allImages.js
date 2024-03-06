const imagesList = document.getElementById("imagesList");
const sortControll = document.getElementById("sortControll");
const committeeSort = document.getElementById("committeeSort");
const dateSort = document.getElementById("dateSort");

let pathToEventImages = "/img/eventImages/";

logInFunctions.push(showRemoveButtons);
logOutFunctions.push(hideRemoveButtons);

let sortMethods = ["committeeSort", "dateSort"];
let selectedSortMethod;

function changeSortMethod(newSort) {
    if (sortMethods.includes(newSort)) {
        if (newSort === "committeeSort") {
            selectedSortMethod = "dateSort"; 
        } else {
            selectedSortMethod = "committeeSort";
        }
    }

    if (selectedSortMethod === "committeeSort") {
        selectedSortMethod = "dateSort";
        committeeSort.classList.remove("selectedSort");
        dateSort.classList.add("selectedSort");
    } else {
        selectedSortMethod = "committeeSort";
        dateSort.classList.remove("selectedSort");
        committeeSort.classList.add("selectedSort");
    }
    localStorage.setItem("selectedSortMethod", selectedSortMethod);
    populateImagesList();
}



changeSortMethod(localStorage.getItem("selectedSortMethod"));

// console.log(selectedSortMethod);

sortControll.addEventListener("click", () => {
    changeSortMethod();
    populateImagesList();
});


async function getImages(){
    try {
        const response = await fetch("/api/images/getAllImages");
        const incomingImages = await response.json();
        return incomingImages;
    } catch (error) {
        console.error("Error fetching upcoming images:", error);
    }
}


async function populateImagesList() {
    let images = await getImages();
    imagesList.innerHTML = "";


    let property = null;
    let datePosters = null;

    images.sort((a, b) => {
        if (selectedSortMethod === "committeeSort"){
            return a.createdBy.localeCompare(b.createdBy);
        } else {
            return a.date.localeCompare(b.date);
        }
    });

    images.forEach(img => {
        let sortElement = null;
        if (selectedSortMethod === "committeeSort"){
            sortElement = img.createdBy;
        } else {
            sortElement = img.date;
        }

        if (property !== sortElement) {
            property = sortElement;

            let dateSection = document.createElement("div");
            dateSection.classList.add("dateSection");
        
            let dateP = document.createElement("h2");
            dateP.textContent = property;
            dateSection.appendChild(dateP);

            datePosters = document.createElement("div");
            dateSection.appendChild(datePosters);

            imagesList.appendChild(dateSection);
        }
        datePosters.appendChild(createImgDiv(img));
    });
}





function createImgDiv(image) {
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("imgDiv");

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("imgContainer");

        const img = document.createElement("img");
        img.src = pathToEventImages + image.path;
        img.classList.add("img")
        imgContainer.appendChild(img);

    imgDiv.appendChild(imgContainer);


    let sortElement = null;
    if (selectedSortMethod === "dateSort"){
        sortElement = image.createdBy;
    } else {
        sortElement = image.date;
    }

    const dateP = document.createElement("p");
    dateP.textContent = sortElement;
    dateP.classList.add("dateP");
    imgDiv.appendChild(dateP);

    if (user !== null){
        if (image.createdBy === user.username || user.accountType === "admin"){
            let removeImageButton = createRemoveImageButton(image, imgDiv);
            imgDiv.appendChild(removeImageButton);
        }
    } else {
        logInFunctions.push(() => { // when logged in, show remove buttons
            if (image.createdBy === user.username || user.accountType === "admin"){
                let removeImageButton = createRemoveImageButton(image, imgDiv);
                imgDiv.appendChild(removeImageButton);
            }
        })
    }

    return imgDiv;
}



function createRemoveImageButton(image, imgDiv){
    let removeImageButton = document.createElement("div");
    removeImageButton.classList.add("removeImageButton");

    let removeImg = document.createElement("img");
    removeImg.src = "../img/icons/remove.svg";
    removeImageButton.appendChild(removeImg);


    removeImageButton.addEventListener("click", () => {
        const data = {
            adminKey: adminKey,
            image: image
        };
    
        fetch('/api/images/removeImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.status === 200) {
                console.log('Image removed successfully!');
                removeImage(imgDiv)
            }
            else {
                return response.text().then(errorMessage => {
                    console.log(errorMessage);
                });
            }
            return response;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
    return removeImageButton;
}

function removeImage(imgDiv) {
    if (imgDiv.parentNode.children.length === 1){ // if dateSection has no images left, remove it
        imgDiv.parentNode.parentNode.parentNode.removeChild(imgDiv.parentNode.parentNode);
    } else {
        imgDiv.parentNode.removeChild(imgDiv);
    }
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

populateImagesList();