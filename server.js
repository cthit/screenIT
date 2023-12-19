import express from 'express';
import path from 'path';
import backRouter from './backend/router';

const app = express();
const port = 3000;

// Serve the HTML pages from the public directory
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api',backRouter)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
