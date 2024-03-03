var menuItems = [
    { text: "Manage People", href: "/managePeople.html" },
    { text: "Manage images", href: "/allImages.html" },
    { text: "Gallery", href: "/gallery.html" },
    { text: "Upload Images", href: "/index.html" }
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
    menu.classList.add("optionsMenu");

    menuItems.forEach(function(item) {
        if (item.href !== window.location.pathname) {
            var link = document.createElement("a");
            link.href = item.href;
            link.textContent = item.text;
            link.classList.add("optionsButton");
            menu.appendChild(link);
        }
    });
    
    // Add login button
    loginButton = document.createElement("div"); // Assign to the global loginButton variable
    loginButton.id = "openLoginButton";
    loginButton.textContent = "Log in";
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




document.addEventListener('DOMContentLoaded', function() {
    let closeButtons = document.getElementsByClassName('closeButton');

    for (const button of closeButtons) {
        button.addEventListener('click', () => {
            button.parentNode.classList.toggle('hidden');
        });
    };
    
    
    function createRandomSuffix(){
        let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return uniqueSuffix;
    }

});


