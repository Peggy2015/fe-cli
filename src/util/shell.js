import shell from 'shelljs';
import log from './log.js';

async function shelljs (cmd, options = {}) {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, options, (error, stdout) => {
      if (error) {
        log.error(`exec error: ${error}`)
        reject(error)
      }

      resolve(stdout)
    })
  });
}

export {
  shelljs,
}