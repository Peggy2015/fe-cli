#! /usr/bin/env node

import { readFileSync } from 'node:fs';
import log from './util/log.js';
import { checkUpdateCli } from './util/update-cli.js';
import { registerCommand } from './module/command.js';

// 主流程
async function init(){

  // 启动
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url),{encoding:"utf-8"}));
  const cliName = Object.keys(pkg.bin)[0];
  log.info(`
欢迎使用前端cli工具:${cliName}
version:${pkg.version}
当前路径:${process.cwd()}
-----------------------------------------------------`);

  // 获取配置，看后续需要什么全局配置,目前没有

  // 脚手架版本检测
  const config = {
    packageName:pkg.name,
    version:pkg.version,
    cliName,
  };
  await checkUpdateCli(config);

  // 注册命令
  registerCommand({
    name:cliName,
  });
}

init();
