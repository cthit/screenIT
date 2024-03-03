
createLoginDiv();
const loginDiv = document.getElementById('loginDiv');
const submitLoginButton = document.getElementById('submitLoginButton');
const openCreatePostButton = document.getElementById('openCreatePostButton');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const loginNotificationDiv = document.getElementById('loginNotification');

let adminButtons = document.getElementsByClassName('adminButton');

let logInFunctions = [];
let logOutFunctions = [];

let isLoggedIn = false;
let adminKey = null;
let username = null;

const loginNotificationTime = 3 * 1000; // 3 seconds




function createLoginDiv() {
    let loginDiv = document.createElement('aside');
    loginDiv.id = 'loginDiv';
    loginDiv.classList.add('popupWindow', 'hidden');

    let closeButton = document.createElement('div');
    closeButton.classList.add('closeButton');
    loginDiv.appendChild(closeButton);

    let loginForm = document.createElement('div');
    loginForm.classList.add('loginForm');
    loginDiv.appendChild(loginForm);

    let usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.placeholder = 'Username';
    usernameInput.required = true;
    loginForm.appendChild(usernameInput);

    let passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Password';
    passwordInput.required = true;
    loginForm.appendChild(passwordInput);

    let submitLoginButton = document.createElement('button');
    submitLoginButton.id = 'submitLoginButton';
    submitLoginButton.textContent = 'Log in';
    loginForm.appendChild(submitLoginButton);

    const notification = document.createElement('div');
    notification.id = 'loginNotification';
    notification.classList.add('notification');
    
    loginDiv.appendChild(notification);

    document.body.appendChild(loginDiv);
}


function logout() {
    isLoggedIn = false;
    adminKey = null;
    localStorage.removeItem('adminKey');
    for (const button of adminButtons) {
        button.classList.add('hidden');
    }
    loginButton.textContent = 'Log in';

    logOutFunctions.forEach(func => func());
}

function login() {
    const loginCredentials = {
        username: usernameInput.value,
        password: passwordInput.value
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials)
    })
    .then(response => {
        if (response.status === 401) {
            notify(loginNotificationDiv, 'Invalid credentials', loginNotificationTime, 'red');
            throw new Error('Invalid credentials');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        adminKey = data.adminKey;
        username = usernameInput.value;

        localStorage.setItem('adminKey', adminKey);
        console.log("Login successful");

        userIsLoggedIn();
        
    })
}

function testAdminKeyOnLoad() {
    adminKey = localStorage.getItem('adminKey');
    // console.log('adminKey: ', adminKey);
    if (adminKey) {
        fetch('/testAdminKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({adminKey})
        })
        .then(response => {
            if (response.status === 200) {
                console.log('Saved adminKey was valid');
                userIsLoggedIn();
            }
            if (response.status === 401) {
                localStorage.removeItem('adminKey');

            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;
        })
    }
}


function userIsLoggedIn(){
    isLoggedIn = true;
    loginDiv.classList.add('hidden');   
    
    if (loginButton) {
        loginButton.textContent = 'Log out'; // TODO: if needed for when loginbutton has not loaded
    };
    
    usernameInput.value = '';
    passwordInput.value = '';

    for (const button of adminButtons) { // show all admin buttons
        button.classList.remove('hidden');
    }

    logInFunctions.forEach(func => func());
};


submitLoginButton.addEventListener('click', login);

testAdminKeyOnLoad();



