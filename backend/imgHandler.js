import fs from 'fs';

import { pathToImagesFile, pathToEventImages } from '../server.js';



export const addImage = (imgData) => {
        let images = fs.readFileSync(pathToImagesFile, 'utf8');
        images = JSON.parse(images);
        images.push(imgData);

        images.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        
        console.log("WOHO! Image added!");
        fs.writeFileSync(pathToImagesFile, JSON.stringify(images, null, 2));
}

export const removeImage = (imgData) => {
    let images = fs.readFileSync(pathToImagesFile, 'utf8');
    images = JSON.parse(images);
    images = images.filter(image => image.id !== imgData.id);
    console.log("WOHO! Image removed!");

    fs.unlinkSync(pathToEventImages + imgData.path);

    fs.writeFileSync(pathToImagesFile, JSON.stringify(images, null, 2));
}

export const imageIsUploadedByUser = (image, userId) => {
    let images = fs.readFileSync(pathToImagesFile, 'utf8');
    images = JSON.parse(images);

    const uploadedImage = images.find(img => {
        return img.id === image.id;
    });

    return userId === uploadedImage.createdBy;
}

export const removeOldImages = () => {
    let imagesData = fs.readFileSync(pathToImagesFile);
    imagesData = JSON.parse(imagesData);
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);

    for (const image of imagesData) {

        if (new Date(image.date) < currentTime) {
            removeImage(image);
        }
    }
};

export const removeUnlinkedImages = () => {
    let imagesData = fs.readFileSync(pathToImagesFile);
    imagesData = JSON.parse(imagesData);
    let images = fs.readdirSync(pathToEventImages);

    for (const image of imagesData) {
        if (!images.includes(image.path)) {
            removeImage(image);
        }
    }
}