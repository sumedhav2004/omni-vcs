const fs = require('fs-extra');
const path = require('path');
const fileSystem = require('./fileSystem');

module.exports = {
  isRepository: () => {
    const repoPath = path.join(process.cwd(), '.omni');
    return fileSystem.fileExists(repoPath);
  },

  getCurrentBranch: () => {
    const headPath = path.join(process.cwd(), '.omni', 'HEAD');
    if (!fileSystem.fileExists(headPath)) {
      throw new Error('No HEAD found, not in a repository.');
    }
    const ref = fileSystem.readFile(headPath).split(' ')[1].trim();
    return ref.split('/').pop();
  },

  getBranchHistory: (branchName) => {
    const branchPath = path.join(process.cwd(), '.omni', 'refs', 'heads', branchName);
    if (fileSystem.fileExists(branchPath)) {
      return JSON.parse(fileSystem.readFile(branchPath));
    }
    return [];
  },

  updateBranchHistory: (branchName, history) => {
    const branchPath = path.join(process.cwd(), '.omni', 'refs', 'heads', branchName);
    fileSystem.writeFile(branchPath, JSON.stringify(history));
  }
};
