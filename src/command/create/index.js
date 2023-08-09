import { createProject } from './business.js';

export default {
  command:'create [projectName]',
  description: '创建项目',
  option:['-f --force', '是否强制初始化项目'],
  action:createProject,
}