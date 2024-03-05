import { Router } from 'express';
import { uploadPost } from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import * as path from 'path';

import { isAdminKeyValid, getUsernameFromAdminKey, getAccountTypeFromAdminKey, pathToEventImages, pathToImagesFile, pathToUsersFile, logEvent, userHasPermission, getUserIdFromAdminKey } from '../server.js'

const timeWindowBeforeEvents = 14 * 24 * 60 * 60 * 1000; // 24 hours in milliseconds






export default backRouter;