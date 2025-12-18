const fs = require('fs');
const path = require('path');
const glob = require('glob');

const filesToClean = [
  'src/services/**/*.ts',
  'src/components/**/*.tsx',
  'src/hooks/**/*.ts',
  'src/lib/**/*.ts',
  'src/app/**/*.tsx',
];

const rootDir = path.join(__dirname, '..');

console.log('🧹 شروع حذف console.log ها...\n');

let totalCleaned = 0;

filesToClean.forEach(filePattern => {
  const pattern = path.join(rootDir, filePattern);
  
  glob.sync(pattern).forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // حذف console.log با regex دقیق‌تر
    // این regex فقط console.log() را پیدا می‌کند و کل خط را حذف می‌کند
    content = content.replace(/^\s*console\.log\([^)]*\);?\s*$/gm, '');
    
    // حذف خطوط خالی اضافی (بیش از 2 خط خالی متوالی)
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(rootDir, filePath);
      console.log(`✓ ${relativePath}`);
      totalCleaned++;
    }
  });
});

console.log(`\n✅ ${totalCleaned} فایل پاکسازی شد!`);
