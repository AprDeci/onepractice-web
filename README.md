# OnePracticeWeb - 在线考试系统

Readme由AI生成<br>
基于Vue 3和TypeScript构建的在线考试系统，提供完整的考试流程和成绩分析功能。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia + Pinia持久化插件
- **UI框架**: TailwindCSS + DaisyUI + Element Plus
- **路由**: Vue Router
- **API请求**: Alova
- **图表**: Chart.js (用于成绩可视化)
- **动画**: Motion-v + VueUse Gesture

## 主要功能

- **考试系统**
  - 多种题型支持(听力、阅读、写作等)
  - 考试计时功能
  - 答题卡导航
- **考试回顾**
  - 查看考试结果
  - 题目解析
  - 成绩分析图表
- **用户系统**
  - 登录/注册
  - 密码重置
  - 个人信息管理
- **其他功能**
  - 隐私条款展示
  - 服务条款展示

## 项目结构

```
src/
├── assets/            # 静态资源
├── common/            # 公共工具和业务逻辑
│   ├── alert.ts       # 提示工具
│   ├── examMode.ts    # 考试模式逻辑
│   ├── paper.ts       # 试卷相关逻辑
│   └── utils.ts       # 工具函数
├── components/        # 组件
│   ├── exam/          # 考试相关组件
│   ├── examreview/    # 考试回顾组件
│   └── common/        # 公共组件
├── interface/         # TypeScript接口定义
├── page/              # 页面组件
│   ├── examPage.vue       # 考试页面
│   ├── examreviewPage.vue # 考试回顾页面
│   ├── loginPage.vue      # 登录页面
│   └── ...
├── request/           # API请求相关
├── route/             # 路由配置
├── store/             # 状态管理
└── main.ts            # 应用入口
```

## 安装与运行

1. 确保已安装Node.js (>=16.0.0) 和 pnpm
2. 克隆项目
3. 安装依赖:
   ```bash
   pnpm install
   ```
4. 启动开发服务器:
   ```bash
   pnpm dev
   ```

## 构建与部署

生产环境构建:

```bash
pnpm build
```

构建完成后，将`dist`目录部署到Web服务器。

## 许可证

MIT License (详见LICENSE文件)
