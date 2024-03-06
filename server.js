import express from 'express';
import fs from 'fs';
// import backRouter from './backend/backendRouter.js';
import imageRouter from './backend/imageRouter.js';
import peopleRouter from './backend/peopleRouter.js';
import loginRouter from './backend/loginRouter.js';


const app = express();
const port = 8000;

app.use(express.json());

// app.use('/api',backRouter)
app.use('/api/auth', loginRouter);
app.use('/api/people', peopleRouter);
app.use('/api/images', imageRouter);


// Serve static files from the 'public' folder
app.use(express.static('public'));
app.use('/images',express.static('images'));

// Serve the HTML pages from the public directory
app.use('/',express.static('public'));
app.use('/admin',express.static('public/admin.html'));



export const pathToImagesFile = "images.json";
export const pathToAdminKeysFile = "adminKeys.json";
export const pathToUsersFile = "users.json";
export const pathToEventImages = "public/img/eventImages/";
export const pathToLogFile = "logs.json";

const lifeTimeForAdminKeys = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

// LOG SYSTEM

export function logEvent(eventData) {
    const currentDate = new Date().toISOString();
    eventData.date = currentDate;
    
    // Read existing events from file, or create an empty array if the file doesn't exist
    let events = [];
    if (fs.existsSync(pathToLogFile)) {
        events = JSON.parse(fs.readFileSync(pathToLogFile, 'utf8'));
    }

    // Add the new event to the array
    events.push(eventData);

    // Write the updated events array back to the file
    fs.writeFileSync(pathToLogFile, JSON.stringify(events, null, 2));
}

export function userHasPermission(adminKey, accountType) {
    const userAccountType = getAccountTypeFromAdminKey(adminKey);
    
    if (Array.isArray(accountType)) {
        // If accountType is an array, check if the user's account type matches any of the account types in the array
        return accountType.includes(userAccountType);
    } else {
        // If accountType is a string, check if the user's account type matches the specified account type
        return userAccountType === accountType;
    }
}


export function getUserFromAdminKey(adminKey) {
    const validAdminKeys = JSON.parse(fs.readFileSync(pathToAdminKeysFile, 'utf8'));
    // Find the admin key in the adminKeys array
    const adminKeyData = validAdminKeys.find(keyData => keyData.key === adminKey);
    if (!adminKeyData) {
        return null; // Admin key not found
    }

    // Find the user with the same username as the admin key
    let userCredentials = fs.readFileSync(pathToUsersFile, 'utf8');
    userCredentials = JSON.parse(userCredentials); // Parse the JSON string into an object
    const user = userCredentials.find(user => user.id === adminKeyData.id);

    return user;
}   

export function getUsernameFromAdminKey(adminKey) {
    const user = getUserFromAdminKey(adminKey);
    return user.username;
}

export function getAccountTypeFromAdminKey(adminKey) {
    const user = getUserFromAdminKey(adminKey)
    return user.accountType;
}

export function getUserIdFromAdminKey(adminKey) {
    const user = getUserFromAdminKey(adminKey);
    return user.id;
}

export function isAdminKeyValid(adminKey) {
    const currentDate = new Date();
    const validAdminKeys = JSON.parse(fs.readFileSync(pathToAdminKeysFile, 'utf8'));
    // Find the admin key in the adminKeys array
    const adminKeyData = validAdminKeys.find(keyData => keyData.key === adminKey);
    if (!adminKeyData) {
        return false; // Admin key not found
    }

    // Parse the saved date and compare it with ten days ago
    const savedDate = new Date(adminKeyData.date);
    const validTimeForAdminKey = new Date(currentDate - lifeTimeForAdminKeys);

    return savedDate >= validTimeForAdminKey;
}




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
