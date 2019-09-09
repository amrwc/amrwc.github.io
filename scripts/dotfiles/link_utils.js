/**
 * Returns current date-time in 'YYYY_MM_DD_HH_MM_SS' format.
 *
 * @source https://stackoverflow.com/q/7357734/10620237#comment85093531_16426519
 * @returns {string}
 */
exports.getCurrentDateTime = function() {
  return new Date()
    .toJSON()
    .slice(0, 19)
    .replace(/[T\:\-]/g, '_');
};

/**
 * Replaces a dotfile with a symbolic link to its source in the repository.
 * NOTE: The script is Unix-specific due to the shell commands used with exec.
 *
 * @param {string} srcFileName
 * @param {string} destFileName
 * @param {string} srcDirPath
 * @param {string} destDirPath
 */
exports.linkDotfile = function(srcFileName, destFileName, srcDirPath, destDirPath) {
  const execSync = require('child_process').execSync;
  const fs = require('fs');
  const path = require('path');

  const srcFilePath = path.resolve(`${srcDirPath}/${srcFileName}`);
  const destFilePath = path.resolve(`${destDirPath}/${destFileName}`);

  // Test whether the destination file exists.
  const existsDestFile =
    execSync(`test -f "${destFilePath}" && printf "true" || printf "false"`).toString() === 'true'
      ? true
      : false;

  // If the destination exists...
  if (existsDestFile) {
    // ...test whether it's a symlink, since the '-f' flag in test is true for symlinks too...
    const existsDestSymlink =
      execSync(`test -L "${destFilePath}" && printf "true" || printf "false"`).toString() === 'true'
        ? true
        : false;
    // ...and if the file is indeed not a symlink...
    if (!existsDestSymlink) {
      // ...make a dated copy of the file before replacing it with a symlink...
      const backupFilePath =
        destDirPath +
        '/' +
        path.basename(destFilePath, path.extname(destFilePath)) +
        '_backup_' +
        exports.getCurrentDateTime() +
        path.extname(destFilePath);
      fs.copyFileSync(destFilePath, backupFilePath);
    }
    // ...then remove the existing file/symlink.
    fs.unlinkSync(destFilePath);
  }

  fs.symlink(srcFilePath, destFilePath, err => {
    if (err) {
      console.error(err);
      process.exit(err.errno);
    }
  });
};