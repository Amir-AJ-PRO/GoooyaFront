const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const reactQuillPath = path.join(__dirname, '..', 'node_modules', 'react-quill');
const quillPath = path.join(reactQuillPath, 'node_modules', 'quill');

// بررسی وجود react-quill
if (!fs.existsSync(reactQuillPath)) {
  console.log('react-quill not found, skipping quill fix');
  process.exit(0);
}

// بررسی نسخه فعلی quill
if (fs.existsSync(quillPath)) {
  try {
    const packageJsonPath = path.join(quillPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.version && packageJson.version.startsWith('2.')) {
        console.log(`quill is already at version ${packageJson.version}, skipping fix`);
        process.exit(0);
      }
    }
  } catch (error) {
    console.error('Error checking quill version:', error.message);
  }
}

// نصب quill 2.0.3 در react-quill
console.log('Installing quill 2.0.3 in react-quill...');
try {
  execSync('npm install quill@2.0.3 --no-save', {
    cwd: reactQuillPath,
    stdio: 'inherit'
  });
  console.log('Successfully installed quill 2.0.3 in react-quill');
} catch (error) {
  console.error('Error installing quill 2.0.3:', error.message);
  process.exit(1);
}

