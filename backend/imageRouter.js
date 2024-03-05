import { Router } from 'express';
import { uploadPost } from './multer.js';
import { addImage, removeImage } from './imgHandler.js';
import fs from 'fs';
import * as path from 'path';


import { isAdminKeyValid, getUsernameFromAdminKey, pathToEventImages, pathToImagesFile, logEvent, userHasPermission } from '../server.js'

const timeWindowBeforeEvents = 14 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds



const imageRouter = Router();

imageRouter.post('/upload', uploadPost.single('image'), (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	if (!userHasPermission(req.body.adminKey, ["admin", "pr"])) return res.status(403).send("User does not have permission to upload images");
	
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

imageRouter.post('/removeImage', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	console.log(req.body);
	logEvent({
		event: "Image removed",
		user: getUsernameFromAdminKey(req.body.adminKey),
		adminKey: req.body.adminKey,
		image: req.body.image
	});

	removeImage(req.body.image, pathToImagesFile, pathToEventImages);


	res.status(200).send("Image removed successfully!");
});



imageRouter.get('/getFutureImages', (req, res) => {
    let currentTime = new Date(); // Define currentTime here
	currentTime.setHours(0, 0, 0, 0);

    let activePosts = fs.readFileSync(pathToImagesFile, 'utf8');
    activePosts = JSON.parse(activePosts);

    activePosts = activePosts.filter(post => {
		const postDate = new Date(post.date);
		const lastAllowedDay = new Date(currentTime.getTime() + timeWindowBeforeEvents);

		return currentTime <= postDate && postDate < lastAllowedDay;
	});

    res.status(200).send(activePosts);
});

imageRouter.get('/getAllImages', (req, res) => {
	let allImages = fs.readFileSync(pathToImagesFile, 'utf8');
	allImages = JSON.parse(allImages);
	res.status(200).send(allImages);
});


export default imageRouter;