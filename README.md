# Wechat Assistant

PC 微信助手，基于 Electron、WeChat Hook 实现。

> 本仓库发布内容仅供学习研究，请勿用于非法或商业用途！ 如因此引起任何法律纠纷，与作者无关！ 没有后门或木马，也不会获取或存储任何信息。 请按照国家法律法规及腾讯的相关原则学习研究！ 我们不对用户的任何下载或任何行为负责。 请下载后24小时内删除！

## 一、功能一览

- 联系人管理
  * [x] 拍一拍
  *	[x] 发送 “文本、图片、文件、公众号” 消息
  * [x] 支持群发消息
  *	[x] 查看联系人列表、导出联系人列表
- 群聊管理
  *	[x] 发送 “文本、图片、文件、公众号、“@群成员、@全体” 消息
  * [x] 支持群发消息
  *	[x] 查看群聊列表、导出群聊列表
  *	[x] 查看群成员列表、导出群成员列表
  * [x] 邀请成员、退出群聊、删除成员
- 任务管理
  * [x] 定时任务（定时消息）
    * 定时消息（支持 “文本、图片、文件、公众号” 配置）
  * [x] 触发任务（消息防撤回、群红包监控、文本消息监控、消息转发）
- 聊天记录备份
  * [ ] 支持 “好友/群聊” 聊天记录备份
- 工具集
  * [x] OCR 文字识别
  * [ ] ...

## 二、使用说明

> 使用聊天记录备份功能需要首先将手机/平板的聊天记录迁移到电脑上，否则看到的不是完整记录。

[安装及使用说明](doc/使用说明.md)
[聊天记录迁移说明](doc/聊天记录迁移.md)

## 三、开发手册

[开发者手册](doc/开发者手册.md)

## 四、Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=yzqzy/wechat-assistant&type=Date)](https://star-history.com/#yzqzy/wechat-assistant&Date)

## 五、参考

* [wxhelper](https://github.com/ttttupup/wxhelper) : Hook WeChat / 微信逆向
* [Injector](https://github.com/nefarius/Injector) : 注入和弹出 DLL
