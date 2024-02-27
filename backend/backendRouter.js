import express, { Router } from 'express';
import multer from 'multer';
import { uploadPost } from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import * as path from 'path';


const pathToJsonFile = "images.json";

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
	res.status(200).send(activePosts);
});



export default backRouter;