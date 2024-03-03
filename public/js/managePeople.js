const peopleList = document.getElementById('peopleList');

let people = [];
const accountTypes = ['admin', 'pr'];


async function getPeople() {
    return fetch('/api/getPeople', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminKey: adminKey })
        })
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data; // Return the data
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

async function populatePeopleList() {
    const people = await getPeople();

    peopleList.innerHTML = '';
    people.forEach(person => {
        const listItem = createPersonDiv(person);
        peopleList.appendChild(listItem);
    });
}

function createPersonDiv(person) {
    const personDiv = document.createElement('div');
    personDiv.classList.add('personDiv');

    const username = document.createElement('input');
    username.value = person.username;
    personDiv.appendChild(username);

    const password = document.createElement('input');
    password.value = person.password;
    personDiv.appendChild(password);

    const accountTypeSelect = document.createElement('select');
    
    accountTypes.forEach(optionText =>{
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        accountTypeSelect.appendChild(option);
    });
    accountTypeSelect.value = person.accountType;
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


        await fetch('/api/updatePerson', {
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
            console.log(data);
            populatePeopleList();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
    
    personDiv.appendChild(updateButton);


    return personDiv;
}


function flashDiv(div, time){
    div.classList.add("changedPerson");
    setTimeout(function() {
        div.classList.remove("changedPerson");
    }, time); // milliseconds
}

getPeople();
populatePeopleList();