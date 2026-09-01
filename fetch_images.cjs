const https = require('https');
const fs = require('fs');

const itemMap = {
    'Dumbbell': 'Dumbbell', 
    'Barbell': 'Barbell', 
    'Plate': 'Weight_plate', 
    'Kettlebell': 'Kettlebell', 
    'EZ Bar': 'Barbell', 
    'Landmine': 'Barbell', 
    'Trap Bar': 'Trap_bar', 
    'Pull Up Bar': 'Pull-up_(exercise)', 
    'Squat Rack': 'Power_rack', 
    'Flat Bench': 'Bench_(weight_training)', 
    'Adjustable Bench': 'Bench_(weight_training)', 
    'Dip Bar': 'Dip_bar', 
    'Single Cable Machine': 'Cable_machine',
    'Dual Cable Machine': 'Cable_machine',
    'Lat Pulldown Cable': 'Lat_pulldown_machine', 
    'Leg Press Machine': 'Leg_press', 
    'Smith Machine': 'Smith_machine', 
    'T-bar': 'T-bar_row',
    'Stack Machines': 'Weight_machine',
    'Plate Machines': 'Weight_machine',
    'Treadmill': 'Treadmill', 
    'Rowing Machine': 'Indoor_rower', 
    'Spinning': 'Stationary_bicycle', 
    'Elliptical Trainer': 'Elliptical_trainer', 
    'Stair Machine': 'Stairmaster', 
    'Air Bike': 'Stationary_bicycle', 
    'Suspension Band': 'Suspension_training', 
    'Resistance Band': 'Resistance_band', 
    'Battle Rope': 'Battling_ropes', 
    'Rings': 'Gymnastics_rings', 
    'Jump Rope': 'Jump_rope', 
    'Medicine Ball': 'Medicine_ball'
};

const results = {};
const keys = Object.keys(itemMap);

const fetchItem = (index) => {
    if (index >= keys.length) {
        fs.writeFileSync('wiki_images.json', JSON.stringify(results, null, 2));
        console.log('Done!');
        return;
    }

    const key = keys[index];
    const term = itemMap[key];
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(term)}`;
    
    https.get(url, { headers: { 'User-Agent': 'Node.js Bot' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                const pages = json.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pages[pageId].original) {
                    results[key] = pages[pageId].original.source;
                } else {
                    console.log('No image for', key, term);
                }
            } catch (e) {
                console.error('Error parsing', key);
            }
            setTimeout(() => fetchItem(index + 1), 500); // 500ms delay
        });
    }).on('error', (e) => {
        console.error(e);
        setTimeout(() => fetchItem(index + 1), 500);
    });
};

fetchItem(0);
