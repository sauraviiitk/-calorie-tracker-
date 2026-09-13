const fs = require('fs');
const path = require('path');
const srcDir = path.join(process.cwd(), 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const files = [];
walkDir(srcDir, f => files.push(f));

let hasError = false;
files.filter(f => f.endsWith('.js') || f.endsWith('.jsx')).forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match both import statements and dynamic imports
  const importRegex = /import\s+(?:.*?\s+from\s+)?['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const resolvedPath = path.resolve(path.dirname(file), importPath);
      let found = false;
      const extensions = ['', '.js', '.jsx', '/index.js', '/index.jsx'];
      
      for (const ext of extensions) {
        if (fs.existsSync(resolvedPath + ext)) {
           // check case exactly
           const dir = path.dirname(resolvedPath + ext);
           const base = path.basename(resolvedPath + ext);
           try {
             const actualFiles = fs.readdirSync(dir);
             if (!actualFiles.includes(base)) {
               console.log('Case mismatch in ' + file + ': imported as ' + importPath + ' but actual file is ' + actualFiles.find(f => f.toLowerCase() === base.toLowerCase()));
               hasError = true;
             }
           } catch(e) {}
           found = true;
           break;
        }
      }
      if (!found) {
        console.log('Missing import in ' + file + ': ' + importPath);
        hasError = true;
      }
    }
  }
});
if(!hasError) console.log('No case mismatch found!');
