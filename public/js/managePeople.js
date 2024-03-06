const peopleList = document.getElementById('peopleList');


let people = [];
const accountTypes = ['admin', 'pr'];

logInFunctions.push(populatePeopleList);
logOutFunctions.push(populatePeopleList);



async function getPeople() {
    return fetch('/api/people/getPeople', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminKey: adminKey })
        })
        .then(response => {
            if (response.status === 403) {
                console.log('Not authorized');
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data; // Return the data
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

async function populatePeopleList() {
    if (isLoggedIn === false) return; // dont do anything if not signed in
    else {
        const people = await getPeople();

        peopleList.innerHTML = '';

        people.forEach(person => {
            const listItem = createPersonDiv(person);
            peopleList.appendChild(listItem);
        });
        if (people[0].accountType === "admin") { // user is admin, can add people
                const addPersonDiv = createAddPersonDiv();
                peopleList.appendChild(addPersonDiv);
        } else { // user is pr, user cannot change account type
            const personDiv = peopleList.getElementsByTagName('div')[0];
            personDiv.getElementsByTagName('select')[0].classList.add('hidden');
        }
    }
}

function createPersonDiv(person) {
    const personDiv = document.createElement('div');
    personDiv.classList.add('personDiv');

    const username = document.createElement('input');
    username.classList.add('darkInput');
    username.value = person.username;
    username.addEventListener('change', () => {
        if (username.value !== person.username) username.classList.add('changedField');
        else username.classList.remove('changedField');
    });
    personDiv.appendChild(username);

    const password = document.createElement('input');
    password.value = person.password;
    password.classList.add('darkInput', 'password');

    password.addEventListener('change', () => {
        if (password.value !== person.password) password.classList.add('changedField');
        else password.classList.remove('changedField');
    });
    personDiv.appendChild(password);

    const accountTypeSelect = document.createElement('select');
    
    accountTypes.forEach(optionText =>{
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        accountTypeSelect.appendChild(option);
    });
    accountTypeSelect.value = person.accountType;
    accountTypeSelect.addEventListener('change', () => {
        if (accountTypeSelect.value !== person.accountType) accountTypeSelect.classList.add('changedField');
        else username.classList.remove('changedField');
    });
    personDiv.appendChild(accountTypeSelect);

  

    const updateButton = document.createElement('img');
    updateButton.src = '/img/icons/check.svg';
    updateButton.classList.add('updateButton');

    updateButton.addEventListener('click', async () => {
        const data = {
            adminKey: adminKey,
            username: username.value,
            password: password.value,
            accountType: accountTypeSelect.value,
            id: person.id
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
            populatePeopleList();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });

    personDiv.appendChild(updateButton);

    if (user.accountType === "admin") { // Make sure only admins see the button to remove people

        const deleteButton = document.createElement('img');
        deleteButton.src = '/img/icons/remove.svg';
        
        deleteButton.addEventListener('click', async () => {
            const data = {
                adminKey: adminKey,
                id: person.id
            }
            await fetch('/api/people/removePerson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (response.status === 200) {
                    populatePeopleList();
                }
                else {
                    console.log(response.message);
                    throw new Error('Network response was not ok');
                }
            })

        });

        personDiv.appendChild(deleteButton);
    }

    


    return personDiv;
}

function createAddPersonDiv() {
    const personDiv = document.createElement('div');
    personDiv.classList.add('personDiv');
    personDiv.classList.add('addPersonDiv');

    const username = document.createElement('input');
    username.classList.add('darkInput');
    username.placeholder = 'Username';
    personDiv.appendChild(username);

    const password = document.createElement('input');
    password.classList.add('darkInput');
    password.placeholder = 'Password';
    personDiv.appendChild(password);

    const accountTypeSelect = document.createElement('select');
    
    accountTypes.forEach(optionText =>{
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        accountTypeSelect.appendChild(option);
    });
    accountTypeSelect.value = accountTypes[accountTypes.length - 1];

    personDiv.appendChild(accountTypeSelect);

    const addButton = document.createElement('img');
    addButton.src = '/img/icons/add.svg';
    addButton.classList.add('updateButton');

    addButton.addEventListener('click', async () => {
        if (username.value === '' || password.value === '') {
            return; // Don't add a person if the username or password is empty
        }
        const data = {
            adminKey: adminKey,
            username: username.value,
            password: password.value,
            accountType: accountTypeSelect.value
        }

        await fetch('/api/people/addPerson', {
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
            populatePeopleList();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
    
    personDiv.appendChild(addButton);

    return personDiv;
};
