import inquirer from 'inquirer';
import log from '../../util/log.js';
import { shelljs } from '../../util/shell.js';
import shell from 'shelljs';
import { readFileSync, writeFileSync } from 'node:fs';
import compressing from 'compressing';

export async function createProject(projectName,options){
  console.log('projectName, options: ',projectName,options);

  // 选择创建项目的方式
  const { type } = await inquirer.prompt([
    {
      type:"rawlist",
      name:"type",
      message:"请选择创建项目的方式:",
      choices:["直接创建","基于git仓库创建"]
    }
  ]);

  if(type === '直接创建'){
    await createBasedNone(projectName);
  }

  if(type === '基于git仓库创建'){
    await createBasedGit(projectName);
  }

  // 选择模版
  shell.cd(projectName);
  await getTemplate(projectName);
  
  log.info(`创建项目${projectName}成功`);
}

// todo
async function createBasedGit(projectName){
  const { gitUrl} = await inquirer.prompt([
    {
      type:"input",
      name:"gitUrl",
      message:"请输入git的http地址:",
    }
  ]);

  if(!gitUrl){
    log.error('git地址不能为空');
    process.exit(-1);
  }

  // 获取git资源
  const code = await shelljs(`git clone ${gitUrl}`,{ fatal:true});
  log.info("git clone success");

  // 设置fork地址
  const { isForkType } = await inquirer.prompt([
    {
      type:"rawlist",
      name:"isForkType",
      message:"是否采用fork工作流？",
      choices:["No","Yes"]
    }
  ]);

  if(isForkType === 'Yes'){
    const { privateGitUrl } = await inquirer
      .prompt({
          type:"input",
          name:"privateGitUrl",
          message:"请输入私仓git的http地址:",
      });

    if(!privateGitUrl){
      log.error('私仓git的http地址不能为空');
      process.exit(-1);
    }

    // 设置地址 
    await shelljs(`git remote set-url origin --push ${privateGitUrl}`,{ fatal:true});
    log.warn('设置fork方式success');
  }

}

async function  createBasedNone (projectName){
  shell.mkdir(projectName);
}

// 选择模版
async function getTemplate(projectName){
   const { templateType } = await inquirer.prompt([
     {
       type:"rawlist",
       name:"templateType",
       message:"请选择初始化项目模版",
       choices:["vue2","reate-native",'none']
     }
   ]);

   if(templateType === 'vue2'){
      await getTemplateVue2();
   }

   if(templateType === 'reate-native'){
      log.warn('待支持');
      process.exit(-1);
   }
}

async function getTemplateVue2(){
  const zipPath = './tmp.tgz';
  await shelljs(`curl -o ${zipPath}  https://cdn.npmmirror.com/packages/chalk/4.1.0/chalk-4.1.0.tgz`,{ fatal:true});
  log.info("get template vue2 success");

  // 解压缩
  await compressing.tgz.uncompress(zipPath,"./tmp",{ignoreBase: true});
  const pkg = JSON.parse(readFileSync(process.cwd()+'/tmp/package/package.json',{encoding:"utf-8"}));
  pkg.name = 'test-chalk2';
  writeFileSync(process.cwd()+'/tmp/package/package.json',JSON.stringify(pkg),{encoding:"utf8"});

  // 移动到正确的位置
  let res = shell.cp("-r",process.cwd()+'/tmp/package/*',process.cwd());
  shell.echo("shell mv:",res);

  // 删除临时文件
  res = shell.rm('-rf','./tmp');
  shell.echo("shell rm:",res);
  res = shell.rm('-f',zipPath);
  shell.echo("删除临时文件success");  
  
  // 安装依赖
  await shell.exec('npm i');
}
