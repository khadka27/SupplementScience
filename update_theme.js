const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    // Replace direct hex codes
    content = content.replace(/#FBF8F1/gi, '#F9F8F6');
    content = content.replace(/#F7ECDE/gi, '#EFE9E3');
    content = content.replace(/#E9DAC1/gi, '#D9CFC7');

    // Note: we can map the 4th color (#C9B59C) if there's any need, but so far we mapped the 3 existing ones directly.

    if (content !== orig) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            replaceInFile(fullPath);
        }
    }
}

processDirectory('d:\\office\\SupplementScience\\app');
processDirectory('d:\\office\\SupplementScience\\components');
