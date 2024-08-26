const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

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

  const files = fs.readdirSync(stagingPath);

  files.forEach((file) => {
    const filePath = path.join(stagingPath, file);

    // Ensure the path is a file
    if (fs.lstatSync(filePath).isFile()) {
      const fileHash = fs.readFileSync(filePath, 'utf8');
      commitData.files[file] = fileHash;
      fs.removeSync(filePath);
    } else {
      console.log(`Skipping "${file}" as it is not a file.`);
    }
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

