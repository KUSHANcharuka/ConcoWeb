import fs from 'fs';

const filePath = 'C:\\Users\\charu\\.gemini\\antigravity-ide\\brain\\9b3d6315-1e9d-4467-b0fa-602c63ab11e6\\.system_generated\\steps\\313\\content.md';
const html = fs.readFileSync(filePath, 'utf8');

// Use a basic regex to find headings and paragraphs
const matches = html.match(/<(h1|h2|h3|p)[^>]*>([\s\S]*?)<\/\1>/gi) || [];

console.log(`Found ${matches.length} matches.`);

// Print first 100 matches that have actual text content
let count = 0;
for (const match of matches) {
  const text = match.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length > 20) {
    console.log(`- [${match.substring(1, 3)}]: ${text}`);
    count++;
    if (count > 80) break;
  }
}
