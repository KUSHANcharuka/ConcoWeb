const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\charu\\.gemini\\antigravity-ide\\brain\\92258174-3839-423d-942e-bea8522ae8a3\\.system_generated\\logs\\transcript.jsonl';
const outputPath = path.join(__dirname, 'full_request.txt');

async function extract() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.trim()) {
      try {
        const obj = JSON.parse(line);
        if (obj.step_index === 1543) {
          fs.writeFileSync(outputPath, obj.content, 'utf8');
          console.log('Successfully wrote request content to scratch/full_request.txt');
          break;
        }
      } catch (e) {
        // ignore malformed lines
      }
    }
  }
}

extract();
