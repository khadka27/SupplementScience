const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if(fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/process\.env\.NEXT_PUBLIC_BASE_URL\s*\|\|\s*(['"])https:\/\/www\.supplementdecoded\.com\1/g, 
    '(((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\\/\\/supplementdecoded\\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string)'
  );
  
  // also fix without as string for non ts files
  if (filePath.endsWith('.js')) {
    newContent = content.replace(/process\.env\.NEXT_PUBLIC_BASE_URL\s*\|\|\s*(['"])https:\/\/www\.supplementdecoded\.com\1/g, 
      '((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\\/\\/supplementdecoded\\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com")'
    );
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

walkDir('app', processFile);
if (fs.existsSync('next-sitemap.config.js')) {
    processFile('next-sitemap.config.js');
}
if (fs.existsSync('lib/schema.ts')) {
    processFile('lib/schema.ts');
}
