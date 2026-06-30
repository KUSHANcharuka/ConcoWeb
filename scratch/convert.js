import fs from 'fs';
import path from 'path';

const tsPath = path.resolve('src/lib/blog-data.ts');
const jsonPath = path.resolve('src/lib/blog-posts.json');

let content = fs.readFileSync(tsPath, 'utf8');

// Strip TypeScript interface
content = content.replace(/export interface BlogPost[\s\S]*?\n\}/, '');

// Strip type annotation
content = content.replace(': BlogPost[]', '');

// Strip 'export '
content = content.replace('export const blogPosts', 'const blogPosts');

// Append code to write json
content += `\nfs.writeFileSync('${jsonPath.replace(/\\/g, '/')}', JSON.stringify(blogPosts, null, 2));\n`;

// Run it using eval since we are in ES Module context
eval(content);
console.log('Successfully converted blog posts to JSON!');
