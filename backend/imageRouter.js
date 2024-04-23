import { Router } from 'express';
import { uploadPost } from './multer.js';
import { addImage, removeImage, imageIsUploadedByUser, removeOldImages, removeUnlinkedImages } from './imgHandler.js';
import fs from 'fs';
import * as path from 'path';


import { isAdminKeyValid, getUserFromAdminKey, getUsernameFromAdminKey, pathToEventImages, pathToImagesFile, pathToUsersFile, logEvent, userHasPermission, getUserIdFromAdminKey } from '../server.js'

const imageRouter = Router();


const timeWindowBeforeEvents = 14 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const intervalForRemovingOldImages = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Remove old and unlinked images upon server start and then every 24 hours
setTimeout(removeOldImages, 1000);
let removeOldImagesTimer = setTimeout(() => {
	repeatedlyRemoveBadImages();
}, intervalForRemovingOldImages);

function repeatedlyRemoveBadImages() {
	removeOldImages();
	removeUnlinkedImages
	removeOldImagesTimer = setTimeout(repeatedlyRemoveBadImages, intervalForRemovingOldImages);
}



imageRouter.post('/upload', uploadPost.single('image'), (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	if (!userHasPermission(req.body.adminKey, ["admin", "pr"])) return res.status(403).send("User does not have permission to upload images");
	
	let newPost = {
		id: req.body.id,
		path: path.basename(req.file.path),
		date: req.body.validUntil,
		creationDate: new Date().toISOString(),
		createdBy: getUserIdFromAdminKey(req.body.adminKey)
	}
	if (req.body.eventName) newPost.eventName = req.body.eventName;

	addImage(newPost);

	res.status(200).send("Image uploaded successfully!");
	logEvent( {
		event: "Image uploaded",
		user: getUsernameFromAdminKey(req.body.adminKey),
		adminKey: req.body.adminKey,
		image: newPost
	});
});

imageRouter.post('/removeImage', (req, res) => {
	const image = req.body.image;
	const adminKey = req.body.adminKey;
	const allowedToRemove = userHasPermission(adminKey,"admin") || imageIsUploadedByUser(image, getUserIdFromAdminKey(adminKey))

	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	

	if (!allowedToRemove) return res.status(403).send("User does not have permission to remove this image");


	logEvent({
		event: "Image removed",
		user: getUsernameFromAdminKey(req.body.adminKey),
		adminKey: req.body.adminKey,
		image: image
	});

	removeImage(image);


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

	let users = fs.readFileSync(pathToUsersFile, 'utf8');
	users = JSON.parse(users);

	allImages.forEach(image => {
		const creator = users.find(user => user.id === image.createdBy);
		if (creator) image.createdBy = creator.username;
		else image.createdBy = "Unknown user";
	});

	res.status(200).send(allImages);
});



export default imageRouter;