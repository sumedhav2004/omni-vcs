const fs = require('fs-extra');
const path = require('path');

module.exports = (branchName) => {
  const repoPath = path.join(process.cwd(), '.omni');
  const targetBranchPath = path.join(repoPath, 'refs', 'heads', branchName);

  if (!fs.existsSync(targetBranchPath)) {
    console.log(`Branch "${branchName}" does not exist.`);
    return;
  }

  const headPath = path.join(repoPath, 'HEAD');
  const ref = fs.readFileSync(headPath, 'utf8').split(' ')[1];
  const currentBranchPath = path.join(repoPath, ref.trim());

  const currentBranchHistory = JSON.parse(fs.readFileSync(currentBranchPath, 'utf8'));
  const targetBranchHistory = JSON.parse(fs.readFileSync(targetBranchPath, 'utf8'));

  const mergedHistory = [...new Set([...currentBranchHistory, ...targetBranchHistory])];
  fs.writeFileSync(currentBranchPath, JSON.stringify(mergedHistory));

  console.log(`Blended branch "${branchName}" into the current branch.`);
};
