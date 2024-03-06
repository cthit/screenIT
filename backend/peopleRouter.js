import { Router } from 'express';
import fs from 'fs';


import { isAdminKeyValid, userHasPermission, pathToUsersFile, getUserIdFromAdminKey, getAccountTypeFromAdminKey } from '../server.js'


const peopleRouter = Router();




// PEOPLE MANAGEMENT

peopleRouter.post('/getPeople', (req, res) => {
	const adminKey = req.body.adminKey;	

	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);
	if (userHasPermission(adminKey, "admin")) {
		people.sort((a, b) => {
			if (a.id === getUserIdFromAdminKey(adminKey)) return -1;
			if (b.id === getUserIdFromAdminKey(adminKey)) return 1;
			return 0;
		});
	}

	if (userHasPermission(adminKey, "admin")) {
		res.status(200).send(people);
	} else if (userHasPermission(adminKey, "pr")) {
		people = people.filter(person => person.id === getUserIdFromAdminKey(adminKey));
		res.status(200).send(people);
	} else {
		res.status(403).send();
		console.log("user has account type: " + getAccountTypeFromAdminKey(adminKey))
	}
});

peopleRouter.post('/updatePerson', (req, res) => {
	const adminKey = req.body.adminKey;
	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	if(userHasPermission(adminKey, "pr") && req.body.id !== getUserIdFromAdminKey(adminKey)) return res.status(403).send("User does not have permission to update account type to admin");

	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);

	if (!people.find(person => person.id === req.body.id)) return res.status(404).send("Person not found!");

	const personIndex = people.findIndex(person => person.id === req.body.id);
	
	people[personIndex].username = req.body.username,
	people[personIndex].password = req.body.password,
	people[personIndex].id = req.body.id
	
	if (userHasPermission(adminKey, "admin") && req.body.accountType) {
		console.log("aboit to change", req.body.accountType)
		people[personIndex].accountType = req.body.accountType;
	}

	fs.writeFileSync(pathToUsersFile, JSON.stringify(people, null, 2), 'utf8');
	res.status(200).send("Person updated successfully!");	
	});

peopleRouter.post('/addPerson', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	if(!userHasPermission(req.body.adminKey, "admin")) return res.status(403).send("User does not have permission to add people");

	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);

	let newPerson = {
		username: req.body.username,
		password: req.body.password,
		accountType: req.body.accountType,
		id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
	};

	people.push(newPerson);
	fs.writeFileSync(pathToUsersFile, JSON.stringify(people, null, 2), 'utf8');
	res.status(200).send("Person added successfully!");
});

peopleRouter.post('/removePerson', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	if(!userHasPermission(req.body.adminKey, "admin")) return res.status(403).send("User does not have permission to remove people");

	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);

	if (!people.find(person => person.id === req.body.id)) return res.status(404).send("Person not found!");

	people = people.filter(person => person.id !== req.body.id);

	fs.writeFileSync(pathToUsersFile, JSON.stringify(people, null, 2), 'utf8');
	res.status(200).send("Person removed successfully!");
});


export default peopleRouter;