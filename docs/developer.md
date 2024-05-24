# 如何开发

项目基于 Electron + Vue3 + Pinia + Typescript。

node 版本 >= 18.15.0

## 一、目录结构

```
.
├─ docs  # 文档目录
├─ electron # 主进程目录
│  ├─ main 
│  │  └─ handler    # 主进程事件处理器
│  │  └─ server     # tcp server，接收 wxhelper 消息
│  │  └─ utils      # 工具函数
│  │  └─ index.ts   # 入口文件
│  ├─ preload
│  │  └─ index.ts   # 预加载脚本
├─ public # 静态资源目录
├─ src    # 渲染进程目录
│  ├─ api           # api 定义
│  ├─ assets        # 静态资源目录
│  ├─ bridge        # 主进程渲染进程通信
│  ├─ components    # 组件目录
│  ├─ composables   # 通用 hook
│  ├─ router        # 路由目录
│  ├─ store         # 状态管理
│  ├─ typings       # 类型定义
│  ├─ views         # 页面目录
│  └─ App.vue       # 根组件
│  └─ main.ts       # 入口文件
├─ testings # 测试用例目录
├─ .env # 配置文件
└─ package.json
```

## 二、开发环境

### 安装依赖

```bash
npm install
```
### 启动开发环境

```bash
npm run dev
```

## 三、生产环境

```bash
npm run build
```

> 默认编译当前运行平台的安装包
