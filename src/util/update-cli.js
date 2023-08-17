import { execSync } from 'child_process';
import log from './log.js';
import * as semver from 'semver';
import inquirer from 'inquirer';
import { waitTime } from './util.js';
import ora from 'ora';
import chalk from 'chalk';

async function checkUpdateCli(option){
  const { packageName, version, cliName } = option;
  const spanner = ora(`检测${cliName}最新版本中...`).start();

  // 获取最新的版本，如果有新的, 提示更新（可选）;如果没有或者失败，直接跳过
  // 目前没有指定cli的npm仓库
  const result = await Promise.any([
    execSync(
    `npm info ${packageName} version --nochecklatest`,
    { encoding:'utf-8'}
    ), 
    waitTime(3000)
  ]);

  if(result){
    const lastVersion = semver.clean(result);
    const needUpdate = semver.valid(lastVersion) && semver.gt(lastVersion,version);

    if(!needUpdate){
      spanner.succeed(chalk.green('当前版本已经是最新版本'));
      return false;
    }
    spanner.info(`你的${cliName} 当前版本为：${version}，最新版本为：${lastVersion}`);

    const answers = await inquirer.prompt({
      type:"rawlist",
      name:"needUpdateCli",
      message:`需要升级吗？`,
      choices:["立即升级","暂不升级"]
    });
    const { needUpdateCli } = answers;
    if( needUpdateCli === '暂不升级'){
      return false;
    }

    // 升级
    console.info(
      `请可以使用命令：npm install -g ${packageName} 进行升级`
    );
    process.exit(-1);
  }else{
    spanner.warn(chalk.yellow(`脚手架${cliName}当前版本为：${version}; 获取最新的版本失败`));
  }
}

export {
  checkUpdateCli,
};

