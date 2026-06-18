const fs = require('fs');

const path = 'src/app/learnmore/auto-conversion-2d-to-3d/page.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const newLines = lines.map(line => {
    let replacedLine = line;

    // Replace hover:text-lime
    if (replacedLine.includes('group-hover:text-lime')) {
        replacedLine = replacedLine.replace(/group-hover:text-lime/g, 'group-hover:text-zinc-600 dark:group-hover:text-zinc-300');
    }

    // Replace text-lime in text tags (span, div)
    if (replacedLine.includes('<span') || replacedLine.includes('<div') || replacedLine.includes('{activeScene === 3 && <span')) {
        // Exclude lines that only use text-lime for icons
        if (
            replacedLine.includes('text-lime') &&
            !replacedLine.includes('<Check') &&
            !replacedLine.includes('<Sparkles') &&
            !replacedLine.includes('<Cpu') &&
            !replacedLine.includes('<Cube') &&
            !replacedLine.includes('<Play') &&
            !replacedLine.includes('text-lime shrink-0') &&
            !replacedLine.includes('rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime') &&
            !replacedLine.includes('w-8 h-8 rounded-lg bg-lime/10 border border-lime/20 flex items-center justify-center text-lime') &&
            !replacedLine.includes('w-16 h-16 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime') &&
            !replacedLine.includes('w-12 h-12 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime') &&
            !replacedLine.includes('w-[85%] h-[85%] relative z-10 text-lime') &&
            !replacedLine.includes('w-[80%] h-[80%] relative z-10 text-lime') &&
            !replacedLine.includes('className="w-full h-full text-lime p-2 sm:p-6"') &&
            !replacedLine.includes('w-4 h-4 text-lime') &&
            !replacedLine.includes('w-12 h-12 text-lime mb-2 animate-bounce')
        ) {
            replacedLine = replacedLine.replace(/text-lime/g, 'text-zinc-900 dark:text-white');
        }
    }

    return replacedLine;
});

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log('Fonts updated successfully.');
