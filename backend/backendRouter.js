import express, { Router } from 'express';
import multer from 'multer';
import { uploadPost } from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import * as path from 'path';


const pathToJsonFile = "images.json";
const pathToEventImages = "public/img/eventImages/";

const backRouter = Router();

backRouter.post('/upload', uploadPost.single('image'), (req, res) => {
	let newPost = {
		path: path.basename(req.file.path),
		date: req.body.validUntil
	}

	addImage(newPost, pathToJsonFile);

	res.status(200).send("Post uploaded successfully!");
});


backRouter.get('/getFutureImages', (req, res) => {
	let activePosts = fs.readFileSync(pathToJsonFile, 'utf8');
	activePosts = JSON.parse(activePosts);
	activePosts = activePosts.filter(post => new Date(post.date) > new Date());
	res.status(200).send(activePosts);
});


backRouter.get('/purge', (req, res) => {
	let posts = fs.readFileSync(pathToJsonFile, 'utf8');
	for (const post of JSON.parse(posts)) {
		try {
			fs.unlinkSync(pathToEventImages + post.path);
		} catch (err) {
			console.error("Error deleting image:", err);
		}
	}

	fs.writeFileSync(pathToJsonFile, JSON.stringify([]));
});



export default backRouter;