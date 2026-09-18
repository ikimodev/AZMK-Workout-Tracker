import fs from 'fs';
import https from 'https';

const url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const dest = "./backend/exercises.json";

const file = fs.createWriteStream(dest);
https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log("Downloaded exercises.json");
  });
}).on('error', function(err) {
  fs.unlink(dest, () => {});
  console.error("Error downloading:", err);
});
