const fs = require('fs-extra');
const path = require('path');

module.exports = (branchName) => {
  const repoPath = path.join(process.cwd(), '.omni');
  const refsPath = path.join(repoPath, 'refs', 'heads', branchName);

  if (fs.existsSync(refsPath)) {
    console.log(`Branch "${branchName}" already exists.`);
    return;
  }

  const headPath = path.join(repoPath, 'HEAD');
  const ref = fs.readFileSync(headPath, 'utf8').split(' ')[1];
  const currentBranchPath = path.join(repoPath, ref.trim());
  const branchHistory = JSON.parse(fs.readFileSync(currentBranchPath, 'utf8'));

  fs.writeFileSync(refsPath, JSON.stringify(branchHistory));
  console.log(`Branch "${branchName}" created.`);
};
