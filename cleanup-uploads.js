const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = './uploads';
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Get all files in the uploads directory
fs.readdir(UPLOADS_DIR, (err, files) => {
  if (err) {
    console.error('Error reading uploads directory:', err);
    process.exit(1);
  }

  const now = Date.now();

  files.forEach(file => {
    const filePath = path.join(UPLOADS_DIR, file);
    
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error getting stats for ${file}:`, err);
        return;
      }

      // Check if file is older than MAX_AGE
      if (now - stats.mtime.getTime() > MAX_AGE) {
        fs.unlink(filePath, err => {
          if (err) {
            console.error(`Error deleting ${file}:`, err);
          } else {
            console.log(`Deleted old file: ${file}`);
          }
        });
      }
    });
  });
});