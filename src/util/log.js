import chalk from 'chalk';

const log = console.log;
const info = (...args)=>{
  log(chalk.green(`[info]`,...args));
};
const warn = (...args)=>{
  log(chalk.hex('#FFA500')(`[warn]`,...args));
}
const error = (...args)=>{
  log(chalk.bold.red(`[error]`,...args));
}

export default {
  log,
  info,
  warn,
  error,
};