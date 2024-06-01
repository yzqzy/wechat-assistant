---
outline: deep
---

# 快速开始

介绍如何快速安装并运行微信助手。


## 一、准备工作

首先需要确认使用哪个版本，可以参考[版本使用说明](./supported-versions.md)。

1. 从 [releases](https://github.com/yzqzy/wechat-assistant/releases) 下载微信助手程序安装包。
2. 从 [WeChat Assets](https://github.com/yzqzy/wechat-assistant/releases/tag/v0.0.0) 中下载需要注入的 dll 等文件。

## 二、安装并运行微信助手

如果你没有注入 dll，会进入以下页面。

<img src="./assets/injector.png" width="600px" />

如果你已经操作成功注入 dll，这时可以正常使用应用。

## 三、Hook 注入

*根据版本不同，需要使用不同的工具和 dll，请务必下载正确的版本。*

### 1. wxhelper

> 推荐使用管理员权限安装并运行微信助手，以便于进行 dll 注入。

> 如果你不会使用命令行工具，可以根据程序中的提示进行操作，选择注入程序和文件，点击注入即可。

使用 Injector 工具进行注入，如果成功的话你将会看到: `Successfully injected module!`

```bash
.\Injector.exe --process-name WeChat.exe --inject .\wxhelper.dll
```

> 如果你的系统不是 64 位或者一直没有注入成功，请参考 [issue-65](https://github.com/ttttupup/wxhelper/discussions/65)、[issue-4](https://github.com/yzqzy/wechat-assistant/issues/4)。

### 2. wechatsdk

wechatsdk 版本的注入方式比较简单，不需要下载 dll 文件。

只需要运行从 [WeChat Assets](https://github.com/yzqzy/wechat-assistant/releases/tag/v0.0.0) 下载的 `wechatsdk_version_API_Launcher_v1.0.3.exe` 程序。填写 `19088` 指定端口，启动微信即可。

## 四、使用微信助手

注入成功，点击页面中的`返回首页`或者重新打开应用，即可使用微信助手。

<img src="./assets/application_mosaic.png" width="600px" />
