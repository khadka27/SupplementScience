const fs = require('fs');
const path = require('path');

function replaceSafely(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    // Globals
    content = content.replace(/dark:from-green-[0-9]+\/[0-9]+ dark:to-emerald-[0-9]+\/[0-9]+/g, '');
    content = content.replace(/dark:from-green-[0-9]+ dark:to-emerald-[0-9]+/g, '');
    content = content.replace(/from-green-50 to-emerald-50/g, 'from-[#FBF8F1] to-[#E9DAC1]');
    content = content.replace(/from-emerald-600 to-teal-500/g, 'from-primary to-primary');

    // Emerald elements
    content = content.replace(/text-emerald-600/g, 'text-primary');
    content = content.replace(/bg-emerald-600/g, 'bg-primary');
    content = content.replace(/bg-emerald-50\/50/g, 'bg-[#F7ECDE]');
    content = content.replace(/hover:bg-emerald-100\/50/g, 'hover:bg-[#E9DAC1]');
    content = content.replace(/border-emerald-100/g, 'border-[#E9DAC1]');
    content = content.replace(/text-emerald-900/g, 'text-black');
    content = content.replace(/text-emerald-700/g, 'text-primary');

    // Any left-over general green texts (to catch any remaining tailwind classes that were missed)
    content = content.replace(/'text-green-600'/g, "'text-primary'");
    content = content.replace(/"text-green-600"/g, '"text-primary"');
    content = content.replace(/"bg-green-50/g, '"bg-[#F7ECDE]');

    if (content !== orig) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated emeralds', filePath);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            replaceSafely(fullPath);
        }
    }
}

processDirectory('d:\\office\\SupplementScience\\app');
processDirectory('d:\\office\\SupplementScience\\components');
