import express, { Router } from 'express';
import { upload} from './multer.js';

const backRouter = Router();

backRouter.post('/upload',upload.single('newsImage'),async (req, res) => {
	console.log(req);
	 if (!req.body.path) {
	 return res.status(400).send('Missing path parameter');
  }

});
export default backRouter;