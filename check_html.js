const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let divCount = 0;
let sectionCount = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<div')) divCount += (line.match(/<div/g) || []).length;
  if (line.includes('</div')) divCount -= (line.match(/<\/div/g) || []).length;
  if (line.includes('<section')) sectionCount += (line.match(/<section/g) || []).length;
  if (line.includes('</section')) sectionCount -= (line.match(/<\/section/g) || []).length;
  if (divCount < 0) console.log('Negative div at line', i + 1);
  if (sectionCount < 0) console.log('Negative section at line', i + 1);
}
console.log('Final div balance:', divCount);
console.log('Final section balance:', sectionCount);
