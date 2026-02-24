const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    // Gradients
    content = content.replace(/from-green-50 via-emerald-50 to-teal-50/g, 'from-[#FBF8F1] via-[#F7ECDE] to-[#E9DAC1]');
    content = content.replace(/dark:from-green-950 dark:via-emerald-950 dark:to-teal-950/g, 'dark:from-[#FBF8F1] dark:via-[#F7ECDE] dark:to-[#E9DAC1]');
    content = content.replace(/from-green-700 to-emerald-600/g, 'from-primary to-primary/80');
    content = content.replace(/dark:from-green-400 dark:to-emerald-400/g, 'dark:from-primary dark:to-primary/80');
    content = content.replace(/from-green-50 to-emerald-50/g, 'from-[#FBF8F1] to-[#F7ECDE]');
    content = content.replace(/dark:from-green-950\/20 dark:to-emerald-950\/20/g, '');
    content = content.replace(/from-green-600 to-emerald-600/g, 'from-primary to-primary/80');
    content = content.replace(/from-green-500\/5/g, 'from-primary/5');

    // Specific Backgrounds
    content = content.replace(/bg-green-50\/50/g, 'bg-[#F7ECDE]/50');
    content = content.replace(/bg-green-50/g, 'bg-[#F7ECDE]');
    content = content.replace(/bg-green-100/g, 'bg-[#E9DAC1]/50');
    content = content.replace(/bg-green-200/g, 'bg-[#E9DAC1]');
    content = content.replace(/bg-green-500\/5/g, 'bg-[#F7ECDE]');
    content = content.replace(/bg-green-500/g, 'bg-primary');
    content = content.replace(/bg-green-600/g, 'bg-primary');
    content = content.replace(/bg-green-700/g, 'bg-primary/90');

    // Dark Backgrounds
    content = content.replace(/dark:bg-green-900\/30/g, '');
    content = content.replace(/dark:bg-green-800\/50/g, '');
    content = content.replace(/dark:bg-green-950\/50/g, '');
    content = content.replace(/dark:bg-[a-z]+-9\d+(\/\d+)?/g, '');

    // Hovers
    content = content.replace(/hover:bg-green-50/g, 'hover:bg-[#F7ECDE]');
    content = content.replace(/hover:bg-green-200/g, 'hover:bg-[#E9DAC1]');
    content = content.replace(/hover:bg-green-600\/10/g, 'hover:bg-[#F7ECDE]');
    content = content.replace(/hover:bg-green-700/g, 'hover:bg-primary/90');

    // Borders
    content = content.replace(/border-green-200/g, 'border-[#E9DAC1]');
    content = content.replace(/border-green-300/g, 'border-[#E9DAC1]');
    content = content.replace(/border-green-600\/20/g, 'border-[#E9DAC1]');
    content = content.replace(/border-green-600/g, 'border-primary');
    content = content.replace(/hover:border-green-300/g, 'hover:border-[#E9DAC1]');
    content = content.replace(/dark:border-green-\d+/g, 'dark:border-[#E9DAC1]');
    content = content.replace(/hover:border-green-\d+/g, 'hover:border-[#E9DAC1]');

    // Text Colors
    content = content.replace(/text-green-50/g, 'text-gray-100');
    content = content.replace(/text-green-100/g, 'text-gray-200');
    content = content.replace(/text-green-600/g, 'text-primary');
    content = content.replace(/text-green-700/g, 'text-primary');
    content = content.replace(/text-green-800/g, 'text-black');
    content = content.replace(/text-green-900/g, 'text-black');
    content = content.replace(/dark:text-green-\d+/g, 'dark:text-primary');
    content = content.replace(/hover:text-green-500/g, 'hover:text-primary');
    content = content.replace(/hover:text-green-600/g, 'hover:text-primary');
    content = content.replace(/hover:text-green-700/g, 'hover:text-primary');

    // Clean redundant spaces Left over  
    content = content.replace(/\s+/g, ' ');
    // but wait! replacing all \s+ will ruin formatting like newlines and indentation! So NO!

    if (content !== orig) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

// Fixed replace function without the devastating global space remove
function replaceInFileSafely(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    // Gradients
    content = content.replace(/from-green-50 via-emerald-50 to-teal-50/g, 'from-[#FBF8F1] via-[#F7ECDE] to-[#E9DAC1]');
    content = content.replace(/dark:from-green-950 dark:via-emerald-950 dark:to-teal-950/g, '');
    content = content.replace(/from-green-700 to-emerald-600/g, 'from-primary to-primary');
    content = content.replace(/dark:from-green-400 dark:to-emerald-400/g, '');
    content = content.replace(/from-green-50 to-emerald-50/g, 'from-[#FBF8F1] to-[#F7ECDE]');
    content = content.replace(/dark:from-green-950\/20 dark:to-emerald-950\/20/g, '');
    content = content.replace(/from-green-600 to-emerald-600/g, 'from-[#E9DAC1] to-[#F7ECDE]');
    content = content.replace(/from-green-500\/5/g, 'from-[#F7ECDE]');

    // Backgrounds
    content = content.replace(/bg-green-50\/50/g, 'bg-[#F7ECDE]');
    content = content.replace(/bg-green-50/g, 'bg-[#F7ECDE]');
    content = content.replace(/bg-green-100/g, 'bg-[#E9DAC1]');
    content = content.replace(/bg-green-200/g, 'bg-[#E9DAC1]');
    content = content.replace(/bg-green-500\/5/g, 'bg-[#F7ECDE]');
    content = content.replace(/bg-green-500/g, 'bg-primary');
    content = content.replace(/bg-green-600/g, 'bg-primary');
    content = content.replace(/bg-green-700/g, 'bg-primary');

    // Dark backgrounds
    content = content.replace(/dark:bg-green-\d+(\/\d+)?/g, '');

    // Hovers
    content = content.replace(/hover:bg-green\-[a-z0-9\/]+/g, 'hover:bg-[#E9DAC1]');
    content = content.replace(/dark:hover:bg-green\-[a-z0-9\/]+/g, '');

    // Borders
    content = content.replace(/border-green-[0-9]+/g, 'border-[#E9DAC1]');
    content = content.replace(/dark:border-green-[0-9]+/g, '');
    content = content.replace(/hover:border-green-[0-9]+/g, 'hover:border-primary');
    content = content.replace(/dark:hover:border-green-[0-9]+/g, '');

    // Text Colors
    content = content.replace(/text-green-50/g, 'text-black');
    content = content.replace(/text-green-100/g, 'text-gray-800');
    content = content.replace(/text-green-[0-9]+/g, 'text-primary');
    content = content.replace(/dark:text-green-[0-9]+/g, '');
    content = content.replace(/hover:text-green-[0-9]+/g, 'hover:text-primary');
    content = content.replace(/dark:group-hover:text-green-[0-9]+/g, '');
    content = content.replace(/group-hover:text-green-[0-9]+/g, 'group-hover:text-primary');

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
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFileSafely(fullPath);
        }
    }
}

processDirectory('d:\\office\\SupplementScience\\app');
processDirectory('d:\\office\\SupplementScience\\components');
