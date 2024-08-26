const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

function traverseDirectory(directoryPath) {
  const files = [];
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.lstatSync(itemPath);

    if (stats.isFile()) {
      files.push(itemPath);
    } else if (stats.isDirectory()) {
      files.push(...traverseDirectory(itemPath)); // Recursively collect files from subdirectories
    }
  });

  return files;
}

module.exports = (message) => {
  const repoPath = path.join(process.cwd(), '.omni');
  const stagingPath = path.join(repoPath, 'staging');

  // Check if staging path exists and has files
  if (!fs.existsSync(stagingPath) || fs.readdirSync(stagingPath).length === 0) {
    console.log('Nothing to snapshot. Stage files first.');
    return;
  }

  // Create commit directory
  const commitId = uuidv4();
  const commitPath = path.join(repoPath, 'objects', commitId);
  fs.ensureDirSync(path.dirname(commitPath)); // Ensure the objects directory exists

  const commitData = {
    message,
    timestamp: new Date(),
    files: {},
  };

  // Get all files recursively from the staging directory
  const files = traverseDirectory(stagingPath);

  files.forEach((filePath) => {
    const relativeFilePath = path.relative(stagingPath, filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    commitData.files[relativeFilePath] = fileContent;
    fs.removeSync(filePath); // Remove the file after adding it to the commit
  });

  // Write commit data to commitPath
  fs.writeFileSync(commitPath, JSON.stringify(commitData, null, 2));

  // Update branch history
  const headPath = path.join(repoPath, 'HEAD');
  const ref = fs.readFileSync(headPath, 'utf8').trim();
  const branchPath = path.join(repoPath, ref);
  let branchHistory = [];

  if (fs.existsSync(branchPath)) {
    branchHistory = JSON.parse(fs.readFileSync(branchPath, 'utf8'));
  }

  branchHistory.push(commitId);
  fs.writeFileSync(branchPath, JSON.stringify(branchHistory, null, 2));

  console.log('Created a new snapshot:', message);
};

