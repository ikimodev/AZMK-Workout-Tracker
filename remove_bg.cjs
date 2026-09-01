const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'assets', 'equipment');
const outputDir = path.join(__dirname, 'public', 'assets', 'equipment', 'transparent');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg'));
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const inputUri = 'file:///' + inputPath.replace(/\\/g, '/');
    const outputPath = path.join(outputDir, file.replace('.jpg', '.png'));
    
    console.log(`Processing ${file}...`);
    try {
      const blob = await removeBackground(inputUri);
      const buffer = Buffer.from(await blob.arrayBuffer());
      fs.writeFileSync(outputPath, buffer);
      console.log(`Saved transparent PNG: ${outputPath}`);
    } catch (e) {
      console.error(`Failed to process ${file}:`, e);
    }
  }
  console.log("Done!");
}

processImages();
