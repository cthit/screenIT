import express from 'express';
import path from 'path';
import backRouter from './backend/router.js';
import exp from 'constants';

const app = express();
const port = 3000;

app.use('/api',backRouter)

app.use(express.static('public'));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));
app.use('/images',express.static('images'));

// Serve the HTML pages from the public directory
app.use('/',express.static('public'));
app.use('/admin',express.static('public/admin.html'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
