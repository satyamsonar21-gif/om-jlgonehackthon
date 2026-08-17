const fs = require('fs');
const path = 'd:/ghr/internship-platform/packages/database/schema.prisma';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
content = content.replace(/@db\.Text/g, '');
content = content.replace(/String\[\]/g, 'String? // comma-separated');
fs.writeFileSync(path, content);
console.log('Done');
