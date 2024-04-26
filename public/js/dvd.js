const logo = document.getElementById('eventImage');
const dvdLogo = document.getElementById('dvdLogo');
const text = document.getElementById('text');

setMaxValues();
let x = Math.random() * maxX;
let y = Math.random() * maxY;



let xVelocity = 2;
let yVelocity = 2;

console.log("maxX: " + maxX)
console.log("maxY: " + maxY)

console.log(x)
console.log(y)


images = [];
let pathToEventImages = "/img/eventImages/";
let currentImage = 0;

function setMaxValues() {
    maxX = window.innerWidth - dvdLogo.offsetWidth;
    maxY = window.innerHeight - dvdLogo.offsetHeight;
}

async function getFutureImages() {
    return await fetch('/api/images/getFutureImages')
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

function nextImage(){ // TODO: This function is what makes the div get stuck in the sides sometimes
    currentImage = (currentImage + 1) % images.length;
    logo.src = pathToEventImages + images[currentImage].path; 

    setMaxValues();
    text.innerHTML = images[currentImage].eventName || "Undertext";
}

getFutureImages().then(newImages => {
        images = newImages
});

function updatePosition() {
    x += xVelocity;
    y += yVelocity;

    if (x <= 0 && xVelocity < 0) {
        nextImage();
        xVelocity *= -1;
    } else if (x >= maxX && xVelocity > 0) {
        nextImage();   
        xVelocity *= -1;
    }

    if (y <= 0 && yVelocity < 0) {
        nextImage();
        yVelocity *= -1;
    } else if (y >= maxY && yVelocity > 0) {
        nextImage();
        yVelocity *= -1;
    }

    dvdLogo.style.left = x + 'px';
    dvdLogo.style.top = y + 'px';
}

let intervalId;
intervalId = setInterval(updatePosition, 10);
running = true;

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (running) {
            clearInterval(intervalId);
            running = false;
        } else {
            intervalId = setInterval(updatePosition, 10);
            running = true;
        }
    }
});
