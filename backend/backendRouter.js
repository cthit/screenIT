import express, { Router } from 'express';
import multer from 'multer';
import { uploadPost } from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import * as path from 'path';

import { isAdminKeyValid, getUsernameFromAdminKey } from '../server.js'


const pathToJsonFile = "images.json";
const pathToEventImages = "public/img/eventImages/";

const timeWindowBeforeEvents = 14 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const backRouter = Router();



backRouter.post('/upload', uploadPost.single('image'), (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	let newPost = {
		path: path.basename(req.file.path),
		date: req.body.validUntil
	}

	addImage(newPost, pathToJsonFile);

	res.status(200).send("Image uploaded successfully!");
});


backRouter.get('/getFutureImages', (req, res) => {
    let currentTime = new Date(); // Define currentTime here

    let activePosts = fs.readFileSync(pathToJsonFile, 'utf8');
    activePosts = JSON.parse(activePosts);

    activePosts = activePosts.filter(post => {
        const postDate = new Date(post.date);
        const timeDifference = postDate - currentTime;
        return timeDifference >= 0 && timeDifference <= timeWindowBeforeEvents;
    });

    res.status(200).send(activePosts);
});



backRouter.post('/purge', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	let posts = fs.readFileSync(pathToJsonFile, 'utf8');

	for (const post of JSON.parse(posts)) {
		try {
			fs.unlinkSync(pathToEventImages + post.path);
		} catch (err) {
			console.error("Error deleting image:", err);
		}
	}

	fs.writeFileSync(pathToJsonFile, JSON.stringify([]));
	console.log("Purge complete");
});



export default backRouter;