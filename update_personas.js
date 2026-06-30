const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'persona-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// I will just use string replacements for the specific labels and IDs.

// Contractors
content = content.replace(
  /id: "tendering",\s+label: "Tendering",/g,
  'id: "boq-preparation",\n        label: "BOQ Preparation",'
);
// Wait, replacing "Tendering" to "BOQ Preparation" changes the tendering stage completely.
// Let's do it manually with multi_replace_file_content instead of a script to avoid messy regex.
