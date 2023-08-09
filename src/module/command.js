import { Command } from 'commander';
import { globSync } from 'glob';

// 注册命令
export async function registerCommand(option){
  const { name } = option;
  const program = new Command();

  // 脚手架
  program
    .name(name)
    .usage('<command> [options]')
    .description("前端脚手架");

  // 获取命令行列表
  const commandList = await getCommandList();

  // 注册command
  commandList.forEach((item)=>{
    const { command,description, option,action} = item;
    const instance = program.command(command);
    description && instance.description(description);
    option && instance.option(...option);
    action && instance.action(action);
  });
  program.parse(process.argv);

  // 如果不带参数,显示help
  if (program.args && program.args.length < 1) {
    program.outputHelp();
  }
}

async function getCommandList(){
  const cwd = new URL('../', import.meta.url);
  const files = globSync("command/**/index.js",{cwd:cwd.href});

  const commandList = [];
  for(const filename of files){
    const command = await import(cwd+filename);
    commandList.push(command.default);
  }

  return commandList;
}
