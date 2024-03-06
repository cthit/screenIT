var menuItems = [
    { text: "Upload Images", href: "/index.html", image: "/img/icons/upload.svg"},
    { text: "Gallery", href: "/gallery.html", image: "/img/icons/slideshow.svg"},
    { text: "Manage images", href: "/allImages.html", image: "/img/icons/filter1.svg"},
    { text: "Manage People", href: "/managePeople.html", image: "/img/icons/group.svg" }
];



function createIcon() {
    let link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/img/icons/tv.svg';
    return link;
}

document.head.appendChild(createIcon());

function flashDiv(div, time){
    div.classList.add("changedPerson");
    setTimeout(function() {
        div.classList.remove("changedPerson");
    }, time); // milliseconds
}




let loginButton; // Declare loginButton in the global scope

// Function to create menu items dynamically
function createMenu(callback) {
    var menu = document.createElement("aside");
    menu.id = "optionsMenu";
    menu.classList.add("optionsMenu");

    menuItems.forEach(function(item) {
        if (item.href !== window.location.pathname) {
            const link = document.createElement("a");
            link.href = item.href;
            link.classList.add("optionsButton");

                const image = document.createElement("img");
                image.src = item.image;
                link.appendChild(image);

                const text = document.createElement("p");
                text.textContent = item.text;
                link.appendChild(text);

            menu.appendChild(link);
        }
    });
    
    // Add login button
    loginButton = document.createElement("div"); // Assign to the global loginButton variable
    loginButton.id = "openLoginButton";
    loginButton.classList.add("optionsButton");
        const image = document.createElement("img");
        image.id = "openLoginButtonImage";
        image.src = "/img/icons/login.svg";
        loginButton.appendChild(image);

        const text = document.createElement("p");
        text.id = "openLoginButtonText";
        text.textContent = "Log in";
        loginButton.appendChild(text);
    menu.appendChild(loginButton);
    
    // Append the menu to the body
    document.body.appendChild(menu);

    // Now that the menu and login button are created, find the login button and add event listener
    loginButton.addEventListener('click', () => {
        if (!isLoggedIn) {
            loginDiv.classList.remove('hidden');
        } else {
            logout();
        }
    });

    // Invoke the callback function if provided
    if (callback && typeof callback === "function") {
        callback(loginButton); // Pass loginButton to the callback function
    }
}

// Call the function to create the menu when the page loads
window.onload = function() {
    createMenu(function(loginButton) {
        testAdminKeyOnLoad();
        // You may also call other functions here that depend on the loginButton element
    });
};




let closeButtons = document.getElementsByClassName('closeButton');

for (const button of closeButtons) {
    button.addEventListener('click', () => {
        button.parentNode.classList.toggle('hidden');
    });
};


function notify(notificationDiv, message, notificationTime, color) {
    console.log(color);

    if (color) {
        notificationDiv.style.backgroundColor = color;
    }
    notificationDiv.textContent = message;
    notificationDiv.classList.add('activeNotification')

    setTimeout(() => {
        notificationDiv.textContent = '';
        notificationDiv.classList.remove('activeNotification');
    }, notificationTime);
}






{/* <link rel="manifest" href="/img/favicons/site.webmanifest">

<link rel="apple-touch-icon" sizes="180x180" href="/img/favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/img/favicons/favicon-16x16.png">

<link rel="mask-icon" href="/img/favicons/safari-pinned-tab.svg" color="#212121">
<link rel="shortcut icon" href="/img/favicons/favicon.ico">
<meta name="msapplication-TileColor" content="#212121">
<meta name="msapplication-config" content="/img/favicons/browserconfig.xml">
<meta name="theme-color" content="#212121"> */}

function addManifestThings(){
    // Create link elements
    var manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/img/favicons/site.webmanifest';

    var appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.sizes = '180x180';
    appleTouchIcon.href = '/img/favicons/apple-touch-icon.png';

    var icon32x32 = document.createElement('link');
    icon32x32.rel = 'icon';
    icon32x32.type = 'image/png';
    icon32x32.sizes = '32x32';
    icon32x32.href = '/img/favicons/favicon-32x32.png';

    var icon16x16 = document.createElement('link');
    icon16x16.rel = 'icon';
    icon16x16.type = 'image/png';
    icon16x16.sizes = '16x16';
    icon16x16.href = '/img/favicons/favicon-16x16.png';

    var maskIcon = document.createElement('link');
    maskIcon.rel = 'mask-icon';
    maskIcon.href = '/img/favicons/safari-pinned-tab.svg';
    maskIcon.color = '#212121';

    var shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = '/img/favicons/favicon.ico';

    // Create meta elements
    var msTileColorMeta = document.createElement('meta');
    msTileColorMeta.name = 'msapplication-TileColor';
    msTileColorMeta.content = '#212121';

    var msConfigMeta = document.createElement('meta');
    msConfigMeta.name = 'msapplication-config';
    msConfigMeta.content = '/img/favicons/browserconfig.xml';

    var themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#212121';

    // Append elements to the head of the document
    document.head.appendChild(manifestLink);
    document.head.appendChild(appleTouchIcon);
    document.head.appendChild(icon32x32);
    document.head.appendChild(icon16x16);
    document.head.appendChild(maskIcon);
    document.head.appendChild(shortcutIcon);
    document.head.appendChild(msTileColorMeta);
    document.head.appendChild(msConfigMeta);
    document.head.appendChild(themeColorMeta);
}

addManifestThings();