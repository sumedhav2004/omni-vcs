const fs = require('fs-extra');
const path = require('path');

module.exports = () => {
  const repoPath = path.join(process.cwd(), '.omni');
  if (fs.existsSync(repoPath)) {
    console.log('Repository already exists.');
    return;
  }
  fs.mkdirSync(repoPath);
  fs.writeFileSync(path.join(repoPath, 'HEAD'), 'ref: refs/heads/main');
  fs.mkdirSync(path.join(repoPath, 'refs'));
  fs.mkdirSync(path.join(repoPath, 'refs', 'heads'));
  fs.mkdirSync(path.join(repoPath, 'objects'));
  fs.mkdirSync(path.join(repoPath, 'staging'));

  console.log('Initialized a new Omni repository.');
};
