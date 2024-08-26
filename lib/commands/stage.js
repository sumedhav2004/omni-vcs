const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

module.exports = (file) => {
  const repoPath = path.join(process.cwd(), '.omni');
  if (!fs.existsSync(repoPath)) {
    console.log('Not an Omni repository. Run `omni start` first.');
    return;
  }
  
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log(`File "${file}" does not exist.`);
    return;
  }

  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha1').update(content).digest('hex');
  const objectPath = path.join(repoPath, 'objects', hash);
  
  if (!fs.existsSync(objectPath)) {
    fs.writeFileSync(objectPath, content);
  }
  
  const stagingPath = path.join(repoPath, 'staging', path.basename(file));
  fs.writeFileSync(stagingPath, hash);
  
  console.log(`Staged "${file}" for the next snapshot.`);
};
