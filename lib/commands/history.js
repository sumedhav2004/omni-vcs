const fs = require('fs-extra');
const path = require('path');

module.exports = () => {
  const repoPath = path.join(process.cwd(), '.omni');
  const headPath = path.join(repoPath, 'HEAD');
  const ref = fs.readFileSync(headPath, 'utf8').split(' ')[1];
  const branchPath = path.join(repoPath, ref.trim());

  if (!fs.existsSync(branchPath)) {
    console.log('No commits found.');
    return;
  }

  const branchHistory = JSON.parse(fs.readFileSync(branchPath, 'utf8'));

  branchHistory.forEach((commitId) => {
    const commitPath = path.join(repoPath, 'objects', commitId);
    const commitData = JSON.parse(fs.readFileSync(commitPath, 'utf8'));
    console.log(`[${commitId}] ${commitData.message} - ${commitData.timestamp}`);
  });
};
