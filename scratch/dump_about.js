import fs from 'fs';

const filePath = 'C:\\Users\\charu\\.gemini\\antigravity-ide\\brain\\9b3d6315-1e9d-4467-b0fa-602c63ab11e6\\.system_generated\\steps\\313\\content.md';
const html = fs.readFileSync(filePath, 'utf8');

console.log("=== MISSION & INTRO ===");
const missionMatch = html.match(/Our mission[\s\S]*?Rippling eliminates/i);
if (missionMatch) {
  console.log(missionMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1000));
} else {
  console.log("No mission match");
}

console.log("\n=== ELIMINATING FRICTION ===");
const frictionMatch = html.match(/Rippling eliminates the friction from running a business[\s\S]*?Meet our leadership/i);
if (frictionMatch) {
  console.log(frictionMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1000));
} else {
  console.log("No friction match");
}

console.log("\n=== LEADERSHIP TEAM ===");
const leadershipMatch = html.match(/Meet our leadership team[\s\S]*?Rippling has a really unusual/i);
if (leadershipMatch) {
  console.log(leadershipMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1000));
} else {
  console.log("No leadership match");
}

console.log("\n=== JOURNEY / HISTORY ===");
const journeyMatch = html.match(/Our Journey[\s\S]*?Engineering at Rippling/i);
if (journeyMatch) {
  console.log(journeyMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1000));
} else {
  console.log("No journey match");
}
