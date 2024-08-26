const fs = require('fs-extra');
const path = require('path');

module.exports = {
  createDirectory: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  },

  writeFile: (filePath, data) => {
    fs.writeFileSync(filePath, data);
  },

  readFile: (filePath) => {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    return null;
  },

  removeFile: (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath);
    }
  },

  listFiles: (dirPath) => {
    if (fs.existsSync(dirPath)) {
      return fs.readdirSync(dirPath);
    }
    return [];
  },

  fileExists: (filePath) => {
    return fs.existsSync(filePath);
  }
};
