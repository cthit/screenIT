import fs from 'fs';

let pathToJsonFile = "images.json";

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

