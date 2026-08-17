const fs = require('fs');
const path = 'd:/ghr/internship-platform/packages/database/schema.prisma';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/@default\((OPEN|SUBMITTED|ACTIVE|PENDING|INFO)\)/g, '@default("$1")');

fs.writeFileSync(path, content);
console.log('Done');
