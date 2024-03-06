
createLoginDiv();
createAccountDiv();
const loginDiv = document.getElementById('loginDiv');
const submitLoginButton = document.getElementById('submitLoginButton');
// const openCreatePostButton = document.getElementById('openCreatePostButton');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const accountDiv = document.getElementById('accountDiv');

const loginNotificationDiv = document.getElementById('loginNotification');

let adminButtons = document.getElementsByClassName('adminButton');

let logInFunctions = [];
let logOutFunctions = [];

let isLoggedIn = false;
let adminKey = null;

let user = null;

const loginNotificationTime = 3 * 1000; // 3 seconds




function createLoginDiv() {
    let loginDiv = document.createElement('aside');
    loginDiv.id = 'loginDiv';
    loginDiv.classList.add('popupWindow', 'credentialsDiv', 'hidden');

    let closeButton = document.createElement('div');

        let closeButtonImg = document.createElement('img');
        closeButtonImg.src = '/img/icons/close.svg';
        closeButton.appendChild(closeButtonImg);
    
    closeButton.classList.add('closeButton');
    loginDiv.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
        loginDiv.classList.add('hidden');
    });

    let loginForm = document.createElement('div');
    loginForm.classList.add('loginForm');
    loginDiv.appendChild(loginForm);

    let usernameInput = document.createElement('input');
    usernameInput.classList.add('darkInput');

    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.placeholder = 'Username';
    // usernameInput.autocomplete = 'on';
    usernameInput.required = true;
    loginForm.appendChild(usernameInput);

    let passwordInput = document.createElement('input');
    passwordInput.classList.add('darkInput');
    // passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Password';
    // passwordInput.autocomplete = 'on';
    passwordInput.required = true;
    loginForm.appendChild(passwordInput);

    let submitLoginButton = document.createElement('div');
    submitLoginButton.classList.add('optionsButton', 'submitLoginButton');
    submitLoginButton.id = 'submitLoginButton';
    submitLoginButton.textContent = 'Log in';
    loginForm.appendChild(submitLoginButton);

    const notification = document.createElement('div');
    notification.id = 'loginNotification';
    notification.classList.add('notification');
    
    loginDiv.appendChild(notification);

    document.body.appendChild(loginDiv);
}

function createCloseButton(parentElement) {
    let closeButton = document.createElement('div');

    let closeButtonImg = document.createElement('img');
    closeButtonImg.src = '/img/icons/close.svg';
    closeButton.appendChild(closeButtonImg);

    closeButton.classList.add('closeButton');
    parentElement.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
        parentElement.classList.add('hidden');
    });

    return closeButton;
}

function createAccountDiv() {
    let accountDiv = document.createElement('aside');
    accountDiv.id = 'accountDiv';
    accountDiv.classList.add('popupWindow', 'credentialsDiv', 'hidden');

    const closeButton = createCloseButton(accountDiv);
    accountDiv.appendChild(closeButton);

    let loginForm = document.createElement('div');
    loginForm.classList.add('loginForm');
    accountDiv.appendChild(loginForm);

    let usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'accountDivUsernameInput';
    usernameInput.placeholder = 'Username';

    usernameInput.addEventListener('change', () => {
        if (usernameInput.value !== user.username) {
            usernameInput.classList.add('changedFieldBorder');
            saveChangesButton.classList.add('accountInputChanged')
        } else {
            usernameInput.classList.remove('changedFieldBorder');
            saveChangesButton.classList.remove('accountInputChanged')
        }
    });

    loginForm.appendChild(usernameInput);

    let passwordInput = document.createElement('input');
    passwordInput.type = 'text';
    passwordInput.id = 'accountDivPasswordInput';
    passwordInput.placeholder = 'Password';
    passwordInput.classList.add('darkInput');

    passwordInput.addEventListener('change', () => {
        if (passwordInput.value !== user.password) {
            passwordInput.classList.add('changedFieldBorder');
            saveChangesButton.classList.add('accountInputChanged')
        } else {
            passwordInput.classList.remove('changedFieldBorder');
            saveChangesButton.classList.remove('accountInputChanged')
        }
    });    
    loginForm.appendChild(passwordInput);


    let buttonDiv = document.createElement('div');
    buttonDiv.classList.add('accountbuttonDiv');

        const saveChangesButton = document.createElement('div');
        saveChangesButton.id = 'saveChangesButton';
        saveChangesButton.classList.add('saveAccountCredentials', 'optionsButton');
        saveChangesButton.textContent = 'Save';


        saveChangesButton.addEventListener('click', async () => {
            const data = {
                adminKey: adminKey,
                username: usernameInput.value,
                password: passwordInput.value,
                id: user.id
            }
    
            await fetch('/api/people/updatePerson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    console.log(response.message);
                    throw new Error('Network response was not ok');
                }
            })
            .then( () => {
                usernameInput.classList.remove('changedFieldBorder');
                passwordInput.classList.remove('changedFieldBorder');
                saveChangesButton.classList.remove('accountInputChanged')
                notify(loginNotificationDiv, 'Changes saved', loginNotificationTime, 'green');}
            )
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        });
        buttonDiv.appendChild(saveChangesButton);

        
        let logOutButton = document.createElement('div');
        logOutButton.classList.add('optionsButton');
        logOutButton.textContent = 'Log Out';
        logOutButton.addEventListener('click', logout);
        
        buttonDiv.appendChild(logOutButton);

    
    loginForm.appendChild(buttonDiv);



    usernameInput.classList.add('darkInput');


    const notification = document.createElement('div');
    notification.id = 'loginNotification';
    notification.classList.add('notification');
    
    accountDiv.appendChild(notification);

    document.body.appendChild(accountDiv);
}

function openAccountDiv() {
    accountDiv.classList.remove('hidden');
    const usernameInput = document.getElementById('accountDivUsernameInput');
    const passwordInput = document.getElementById('accountDivPasswordInput');
    usernameInput.value = user.username;
    passwordInput.value = user.password;
}


function changeVisibleOptionButtons() {
    for (const button of optionButtons) {
        button.classList.toggle('hidden');
    }
}



function logout() {
    accountDiv.classList.add('hidden');
    const openLoginButtonText = document.getElementById('openLoginButtonText');
    const openLoginButtonImage = document.getElementById('openLoginButtonImage');
    isLoggedIn = false;
    adminKey = null;
    localStorage.removeItem('adminKey');

    for (const button of adminButtons) {
        button.classList.add('hidden');
    }
    openLoginButtonText.textContent = 'Log in';
    openLoginButtonImage.src = "/img/icons/login.svg";

    logOutFunctions.forEach(func => func());
}

function login() {
    const loginCredentials = {
        username: usernameInput.value,
        password: passwordInput.value
    };

    fetch('/api/auth/login', {
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
    .then(async (data) => {
        adminKey = data.adminKey;
        user = data.user;

        localStorage.setItem('adminKey', adminKey);
        console.log("Login successful");

        await userIsLoggedIn();
        
    })

    
}

function testAdminKeyOnLoad() {
    adminKey = localStorage.getItem('adminKey');
    if (adminKey) {
        fetch('/api/auth/testAdminKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({adminKey})
        })
        .then(response => {
            if (response.status === 200) {
                console.log('Saved adminKey was valid');
            }
            if (response.status === 401) {
                localStorage.removeItem('adminKey');

            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            user = data.user;
            userIsLoggedIn();
        });
    }
}


async function userIsLoggedIn(){
    isLoggedIn = true;
    loginDiv.classList.add('hidden');   
    
    if (loginButton) {
        openLoginButtonText.textContent = 'Account';
        openLoginButtonImage.src = "/img/icons/person.svg";
    };
    
    usernameInput.value = '';
    passwordInput.value = '';

    for (const button of adminButtons) { // show all admin buttons
        button.classList.remove('hidden');
    }

    logInFunctions.forEach(func => func());
};


submitLoginButton.addEventListener('click', login);
