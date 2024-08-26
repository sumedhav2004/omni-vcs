const fs = require('fs-extra');
const path = require('path');

module.exports = (commitId) => {
  const repoPath = path.join(process.cwd(), '.omni');
  const headPath = path.join(repoPath, 'HEAD');
  const ref = fs.readFileSync(headPath, 'utf8').split(' ')[1];
  const branchPath = path.join(repoPath, ref.trim());

  if (!fs.existsSync(branchPath)) {
    console.log('No commits to undo.');
    return;
  }

  const branchHistory = JSON.parse(fs.readFileSync(branchPath, 'utf8'));
  const index = branchHistory.indexOf(commitId);

  if (index === -1) {
    console.log(`Commit "${commitId}" not found.`);
    return;
  }

  branchHistory.splice(index, 1);
  fs.writeFileSync(branchPath, JSON.stringify(branchHistory));
  console.log(`Undid commit "${commitId}".`);
};
