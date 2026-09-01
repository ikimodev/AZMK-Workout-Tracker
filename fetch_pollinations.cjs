const fs = require('fs');
const path = require('path');
const https = require('https');
const { removeBackground } = require('@imgly/background-removal-node');

const outputDir = path.join(__dirname, 'public', 'assets', 'equipment');

const REMAINING_EQUIPMENT = [
  'Single_Cable_Machine', 'Dual_Cable_Machine', 'Lat_Pulldown_Cable', 
  'Leg_Press_Machine', 'Smith_Machine', 'T-bar', 'Stack_Machines', 
  'Plate_Machines', 'Treadmill', 'Rowing_Machine', 'Spinning_bike', 
  'Elliptical_Trainer', 'Stair_Machine', 'Air_Bike', 'Suspension_Band', 
  'Resistance_Band', 'Battle_Rope', 'Gymnastics_Rings', 'Jump_Rope', 
  'Medicine_Ball'
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if(response.statusCode !== 200) {
        reject(new Error(`Status: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function processItem(item) {
    console.log(`Generating ${item}...`);
    const prompt = encodeURIComponent(`A high quality 3D render of a gym ${item.replace(/_/g, ' ')}, isolated on a pure white background, soft studio lighting, modern minimalist style, front view, UI icon style, no people, no background`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;
    
    const jpgPath = path.join(outputDir, `icon_${item.toLowerCase()}.jpg`);
    const pngPath = path.join(outputDir, `icon_${item.toLowerCase()}.png`);
    
    if (fs.existsSync(pngPath)) {
        console.log(`${item} already exists, skipping.`);
        return;
    }
    
    try {
      await downloadImage(url, jpgPath);
      console.log(`Downloaded ${item}, removing background...`);
      
      const inputUri = 'file:///' + jpgPath.replace(/\\/g, '/');
      const blob = await removeBackground(inputUri);
      const buffer = Buffer.from(await blob.arrayBuffer());
      fs.writeFileSync(pngPath, buffer);
      
      console.log(`Saved transparent PNG: ${pngPath}`);
      fs.unlinkSync(jpgPath); // clean up jpg
    } catch (e) {
      console.error(`Failed on ${item}:`, e);
    }
}

async function processAll() {
  const concurrency = 1;
  for (let i = 0; i < REMAINING_EQUIPMENT.length; i += concurrency) {
      const chunk = REMAINING_EQUIPMENT.slice(i, i + concurrency);
      await Promise.all(chunk.map(processItem));
      await new Promise(r => setTimeout(r, 2000));
  }
  console.log("ALL DONE!");
}

processAll();
