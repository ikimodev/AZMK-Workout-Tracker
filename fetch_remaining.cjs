const https = require('https');
const fs = require('fs');

const itemMap = {
    'Pull Up Bar': 'Pull-up_(exercise)',
    'Flat Bench': 'Bench_(weight_training)',
    'Adjustable Bench': 'Bench_(weight_training)',
    'Lat Pulldown Cable': 'Lat_pulldown_machine',
    'Leg Press Machine': 'Leg_press',
    'Smith Machine': 'Smith_machine',
    'T-bar': 'T-bar_row',
    'Stack Machines': 'Weight_machine',
    'Plate Machines': 'Weight_machine',
    'Treadmill': 'Treadmill',
    'Stair Machine': 'Stairmaster',
    'Suspension Band': 'Suspension_training',
    'Rings': 'Gymnastics_rings',
    'Jump Rope': 'Jump_rope'
};

const results = {};
const keys = Object.keys(itemMap);

const fetchItem = (index) => {
    if (index >= keys.length) {
        fs.writeFileSync('wiki_images2.json', JSON.stringify(results, null, 2));
        console.log('Done!');
        return;
    }

    const key = keys[index];
    const term = itemMap[key];
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(term)}`;
    
    console.log('Fetching', key);
    https.get(url, { headers: { 'User-Agent': 'Node.js Bot/1.0' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.query && json.query.pages) {
                    const pageId = Object.keys(json.query.pages)[0];
                    if (json.query.pages[pageId].original) {
                        results[key] = json.query.pages[pageId].original.source;
                        console.log('Found', key, results[key]);
                    } else {
                        console.log('No image for', key);
                    }
                }
            } catch (e) {
                console.error('Error parsing', key);
            }
            setTimeout(() => fetchItem(index + 1), 2000); // 2 second delay to avoid 429
        });
    }).on('error', (e) => {
        console.error(e);
        setTimeout(() => fetchItem(index + 1), 2000);
    });
};

fetchItem(0);
