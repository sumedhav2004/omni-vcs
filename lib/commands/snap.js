const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

module.exports = (message) => {
  const repoPath = path.join(process.cwd(), '.omni');
  const stagingPath = path.join(repoPath, 'staging');

  if (!fs.existsSync(stagingPath) || fs.readdirSync(stagingPath).length === 0) {
    console.log('Nothing to snapshot. Stage files first.');
    return;
  }

  const files = fs.readdirSync(stagingPath);
  const commitId = uuidv4();
  const commitPath = path.join(repoPath, 'objects', commitId);

  const commitData = {
    message,
    timestamp: new Date(),
    files: {},
  };

  files.forEach((file) => {
    const fileHash = fs.readFileSync(path.join(stagingPath, file), 'utf8');
    commitData.files[file] = fileHash;
    fs.removeSync(path.join(stagingPath, file));
  });

  fs.writeFileSync(commitPath, JSON.stringify(commitData));

  const headPath = path.join(repoPath, 'HEAD');
  const ref = fs.readFileSync(headPath, 'utf8').split(' ')[1];
  const branchPath = path.join(repoPath, ref.trim());
  let branchHistory = [];
  
  if (fs.existsSync(branchPath)) {
    branchHistory = JSON.parse(fs.readFileSync(branchPath, 'utf8'));
  }

  branchHistory.push(commitId);
  fs.writeFileSync(branchPath, JSON.stringify(branchHistory));

  console.log('Created a new snapshot:', message);
};
