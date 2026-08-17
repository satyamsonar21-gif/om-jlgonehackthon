const fs = require('fs');
const path = 'd:/ghr/internship-platform/packages/database/schema.prisma';
let content = fs.readFileSync(path, 'utf8');

// The instructions said "Keep enums exactly as they are", but SQLite doesn't support enums in Prisma.
// To make `prisma db push` succeed, we must convert enums to Strings.
const enums = ['Role', 'InternshipMode', 'ListingStatus', 'ApplicationStatus', 'InternshipStatus', 'AttendanceStatus', 'ReportStatus', 'FeedbackType', 'TaskStatus', 'NotificationType'];

enums.forEach(e => {
    // replace field type with String
    const regex = new RegExp(`(\\w+)\\s+${e}(\\s|\\n)`, 'g');
    content = content.replace(regex, `$1 String$2`);
    const regex2 = new RegExp(`(\\w+)\\s+${e}\\?\\s`, 'g');
    content = content.replace(regex2, `$1 String? `);
    const regex3 = new RegExp(`(\\w+)\\s+${e}(\\s+@default\\([^)]+\\))`, 'g');
    content = content.replace(regex3, `$1 String$2`);
});

// Remove enum blocks
content = content.replace(/enum \w+ \{[^}]+\}/g, '');

fs.writeFileSync(path, content);
console.log('Done');
