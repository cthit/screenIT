import fs from 'fs';

import { pathToImagesFile } from '../server.js';

export const addImage = (imgData, pathToJsonFile) => {
        let images = fs.readFileSync(pathToJsonFile, 'utf8');
        images = JSON.parse(images);
        images.push(imgData);

        images.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        
        console.log("WOHO! Image added!");
        fs.writeFileSync(pathToJsonFile, JSON.stringify(images, null, 2));
}

export const removeImage = (imgData, pathToJsonFile, pathToEventImages) => {
    let images = fs.readFileSync(pathToJsonFile, 'utf8');
    images = JSON.parse(images);
    images = images.filter(image => image.id !== imgData.id);
    console.log("WOHO! Image removed!");

    fs.unlinkSync(pathToEventImages + imgData.path);

    fs.writeFileSync(pathToJsonFile, JSON.stringify(images, null, 2));
}

export const imageIsUploadedByUser = (image, user) => {
    const images = fs.readFileSync(pathToImagesFile, 'utf8');
    const uploadedImage = images.find(img => {
        return img.id === image.id;
    });

    return user.id === uploadedImage.createdBy;
}