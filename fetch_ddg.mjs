import { image_search } from 'duckduckgo-images-api';
import fs from 'fs';

const items = [
    'Dumbbell', 'Barbell', 'Weight plate', 'Kettlebell', 'EZ Bar', 'Landmine exercise', 'Trap Bar', 
    'Pull Up Bar', 'Squat Rack', 'Flat Bench', 'Adjustable Bench', 'Dip Bar',
    'Single Cable Machine', 'Dual Cable Machine', 'Lat Pulldown Cable', 'Leg Press Machine', 'Smith Machine',
    'T-bar row', 'Stack Machines gym', 'Plate Machines gym',
    'Treadmill', 'Rowing Machine', 'Spinning bike', 'Elliptical Trainer', 
    'Stair Machine gym', 'Air Bike gym', 'Suspension Band gym', 'Resistance Band', 
    'Battle Rope', 'Gymnastics Rings', 'Jump Rope', 'Medicine Ball'
];

const results = {};

async function fetchImages() {
    for (const item of items) {
        try {
            console.log(`Searching for ${item}...`);
            const searchResults = await image_search({ query: item + ' gym equipment clear', moderate: true, iterations: 1 });
            if (searchResults.length > 0) {
                // Find a good landscape or square image URL
                let bestImg = searchResults[0].image;
                results[item] = bestImg;
                console.log(`Found image for ${item}`);
            }
        } catch (e) {
            console.error(`Error for ${item}`, e);
        }
        await new Promise(r => setTimeout(r, 1500)); // Delay to avoid ban
    }
    fs.writeFileSync('ddg_images.json', JSON.stringify(results, null, 2));
    console.log('Done!');
}

fetchImages();
