const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

module.exports = (file) => {
  const repoPath = path.join(process.cwd(), '.omni');
  if (!fs.existsSync(repoPath)) {
    console.log('Not an Omni repository. Run `omni start` first.');
    return;
  }

  // Determine if we're staging all files or specific ones
  let filesToStage;
  if (file === '*') {
    // Stage all files in the current directory, excluding directories
    filesToStage = fs.readdirSync(process.cwd()).filter(fileName => {
      return !fs.lstatSync(fileName).isDirectory();
    });
  } else if (file === '.') {
    // Stage all files recursively including in subdirectories
    filesToStage = [];
    const traverseDirectory = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(fileName => {
        const fullPath = path.join(dir, fileName);
        if (fs.lstatSync(fullPath).isDirectory()) {
          traverseDirectory(fullPath);
        } else {
          filesToStage.push(fullPath);
        }
      });
    };
    traverseDirectory(process.cwd());
  } else {
    // Stage the specific file provided
    filesToStage = [file];
  }

  filesToStage.forEach(filePath => {
    filePath = path.resolve(filePath);
    if (!fs.existsSync(filePath)) {
      console.log(`File "${filePath}" does not exist.`);
      return;
    }

    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha1').update(content).digest('hex');
    const objectPath = path.join(repoPath, 'objects', hash);

    if (!fs.existsSync(objectPath)) {
      fs.writeFileSync(objectPath, content);
    }

    const relativeFilePath = path.relative(process.cwd(), filePath);
    const stagingPath = path.join(repoPath, 'staging', relativeFilePath);

    // Ensure the directory for the staged file exists
    fs.ensureDirSync(path.dirname(stagingPath));
    fs.writeFileSync(stagingPath, hash);

    console.log(`Staged "${relativeFilePath}" for the next snapshot.`);
  });
};

