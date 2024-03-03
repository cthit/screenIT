import express, { Router } from 'express';
import multer from 'multer';
import { uploadPost } from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import * as path from 'path';

import { isAdminKeyValid, getUsernameFromAdminKey, getAccountTypeFromAdminKey, pathToEventImages, pathToImagesFile, pathToUsersFile } from '../server.js'


const timeWindowBeforeEvents = 14 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const accountTypesAllowedToAddPeople = ["admin"];



const backRouter = Router();

function userHasPermission(adminKey, accountType) {
	console.log(getAccountTypeFromAdminKey(adminKey) === accountType);
	return getAccountTypeFromAdminKey(adminKey) === accountType;
}



backRouter.post('/upload', uploadPost.single('image'), (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	let newPost = {
		id: req.body.id,
		path: path.basename(req.file.path),
		date: req.body.validUntil,
		creationDate: new Date().toISOString(),
		createdBy: getUsernameFromAdminKey(req.body.adminKey)
	}

	addImage(newPost, pathToImagesFile);

	res.status(200).send("Image uploaded successfully!");
});

backRouter.post('/removeImage', (req, res) => {
	console.log((req.body.adminKey));
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	logEvent({
		event: "Image removed",
		user: getUsernameFromAdminKey(req.body.adminKey),
		adminKey: req.body.adminKey,
		imageId: req.body.id
	});

	let images = fs.readFileSync(pathToImagesFile, 'utf8');
	images = JSON.parse(images);

	fs.unlinkSync(pathToEventImages + images.find(image => image.id === req.body.id).path);

	images = images.filter(image => image.id !== req.body.id);

	fs.writeFileSync(pathToImagesFile, JSON.stringify(images, null, 2), 'utf8');
	res.status(200).send("Image removed successfully!");
});



backRouter.get('/getFutureImages', (req, res) => {
    let currentTime = new Date(); // Define currentTime here

    let activePosts = fs.readFileSync(pathToImagesFile, 'utf8');
    activePosts = JSON.parse(activePosts);

    activePosts = activePosts.filter(post => {
        const postDate = new Date(post.date);
        const timeDifference = postDate - currentTime;
        return timeDifference >= 0 && timeDifference <= timeWindowBeforeEvents;
    });

    res.status(200).send(activePosts);
});

backRouter.get('/getAllImages', (req, res) => {
	let allImages = fs.readFileSync(pathToImagesFile, 'utf8');
	allImages = JSON.parse(allImages);
	res.status(200).send(allImages);
});



backRouter.post('/purge', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	let posts = fs.readFileSync(pathToImagesFile, 'utf8');

	for (const post of JSON.parse(posts)) {
		try {
			fs.unlinkSync(pathToEventImages + post.path);
		} catch (err) {
			console.error("Error deleting image:", err);
		}
	}

	fs.writeFileSync(pathToImagesFile, JSON.stringify([]));
	console.log("Purge complete");
});


// PEOPLE MANAGEMENT

backRouter.post('/getPeople', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	if(!userHasPermission(req.body.adminKey, "admin")) return res.status(403).send("User does not have permission to get people");

	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);
	res.status(200).send(people);
});

backRouter.post('/updatePerson', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	if(!userHasPermission(req.body.adminKey, "admin")) return res.status(403).send("User does not have permission to update people");

	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);
	console.log(people[1].id, req.body.id);
	console.log(req.body);


	if (!people.find(person => person.id === req.body.id)) return res.status(404).send("Person not found!");

	const personIndex = people.findIndex(person => person.id === req.body.id);
	people[personIndex] = {
		username: req.body.username,
		password: req.body.password,
		accountType: req.body.accountType,
		id: req.body.id
	};

	fs.writeFileSync(pathToUsersFile, JSON.stringify(people, null, 2), 'utf8');
	res.status(200).send("Person updated successfully!");	
});



backRouter.post('/addPerson', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	if(accountTypesAllowedToAddPeople.includes(getAccountTypeFromAdminKey(req.body.adminKey))) return res.status(403).send("Adminkey not valid");

	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);

	if (people.find(person => person.username === req.body.username)) return res.status(409).send("Person already exists!");

	people.push({
		username: req.body.username,
		password: req.body.password,
		accountType: req.body.accountType
	});

	fs.writeFileSync(pathToUsersFile, JSON.stringify(people, null, 2), 'utf8');
	res.status(200).send("Person added successfully!");
});

backRouter.post('/removePerson', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	// if(accountTypesAllowedToAddPeople.includes(getAccountTypeFromAdminKey(req.body.adminKey))) return res.status(403).send("Adminkey not valid");
	console.log(req.body.adminKey);
	let people = fs.readFileSync(pathToUsersFile, 'utf8');
	people = JSON.parse(people);
	console.log("lol", people);

	// if (!people.find(person => person.username === req.body.username)) return res.status(404).send("Person not found!");

	people = people.filter(person => person.username !== req.body.username);

	fs.writeFileSync(pathToUsersFile, JSON.stringify(people, null, 2), 'utf8');
	res.status(200).send("Person removed successfully!");
});


export default backRouter;