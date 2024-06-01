---
outline: deep
---

# 版本使用说明

目前客户端主要支持两种类型的 hook，分别是 [wxhelper](https://github.com/ttttupup/wxhelper) 和 [wechatsdk](https://github.com/WeChatAPIs/wechatAPI)。

## 一、hook 介绍

### 1. wxhelper

* 基于微信 Windows 协议开发的。
* 基础功能支持相对较少。
* 免费开源，无使用时长限制。
* 长期使用可能存在封号风险。

### 2. wechatsdk

* 基于微信 Windows 协议和微信安卓协议开发的。
* 基础功能强大，支持各种底层功能。
* 付费 hook，长期使用需购买，支持全功能免费试用。
* 个人用户支持试用7天/企业用户支持试用14天。
* 长期使用稳定性较高，针对官方风控策略及时进行优化。

## 二、版本选择

| 系列      | 微信版本  | 联系人管理 | 群聊管理 | 任务管理 | 聊天记录备份 | 工具集 |
| --------- | --------- | ---------- | -------- | -------- | ------------ | ------ |
| wxhelper  | 3.9.5.81  | ✅          | ✅        | ✅        | ✅            | ✅      |
| wxhelper  | 3.9.8.25  | ✅          | ❌        | ✅        | ✅            | ❌      |
| wechatsdk | 3.9.10.19 | ✅          | ❌        | ✅        | ✅            | ❌      |

> wxhelper 3.9.8.25 版本由于开源功能限制，无法支持群聊管理和工具集模块。

您可以从 [releases](https://github.com/yzqzy/wechat-assistant/releases) 下载微信助手程序安装包。
