# Wechat Assistant

PC 微信助手，基于 Electron、WeChat Hook 实现。

> 本仓库发布内容仅供学习研究，请勿用于非法或商业用途！ 如因此引起任何法律纠纷，与作者无关！ 没有后门或木马，也不会获取或存储任何信息。 请按照国家法律法规及腾讯的相关原则学习研究！ 我们不对用户的任何下载或任何行为负责。 请下载后24小时内删除！

## 一、功能一览

- 联系人管理
  *	[x] 发送 “文本、图片、文件、公众号” 消息
  *	[x] 查看联系人列表、导出联系人列表
  * [x] 拍一拍
- 群聊管理
  *	[x] 发送 “文本、图片、文件、公众号、“@群成员、@全体” 消息
  *	[x] 查看群聊列表、导出群聊列表
  *	[x] 查看群成员列表、导出群成员列表
  * [x] 邀请成员、退出群聊、删除成员
- 其他功能
  * [ ] OCR 文字识别
  * [ ] 天气定时推送
  * [ ] 消息备份、防撤回

## 二、使用说明

### 1. Hook 注入

需要特定的微信版本和dll才能使 windows hook 工作。

> 如果你不会使用命令行工具，可以跳过 3,4 步骤，直接运行微信助手客户端。

1. 从 [release](https://github.com/yzqzy/wechat-assistant/releases/tag/v0.0.0) 中下载相关文件
2. 安装 WeChatSetup 3.9.5.81 版本并且登录
3. 使用 Injector 工具注入 wxhelper.dll 文件

```bash
.\Injector.exe --process-name WeChat.exe --inject .\wxhelper.dll
```

4. 如果成功的话你将会看到: 

```bash
Successfully injected module!
```

### 2. 安装运行微信助手

如果你已经操作成功注入 dll，可以直接使用应用。如果没有注入 dll，会进入以下页面。

<img src="https://img.yueluo.club/wechat-assistant/injector.png" style="zoom: 50%" />

注入成功后，即可正常使用程序。

<img src="https://img.yueluo.club/wechat-assistant/application_mosaic.png" style="zoom: 50%" />

## 三、环境配置

### 开发环境

```bash
npm install
npm run dev
```

### 打包构建

```bash
npm run build
```

## 四、参考

* [wxhelper](https://github.com/ttttupup/wxhelper) : Hook WeChat / 微信逆向
* [Injector](https://github.com/nefarius/Injector) : 注入和弹出 DLL
