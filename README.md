# WeChat Assistant

PC 微信助手，基于 Electron、WeChat Hook 实现。

> ⚠️ **项目状态**：本项目已停止维护，不再接受新功能请求或 bug 修复。

* **Windows 客户端，仅支持 Windows 系统。**
* 本仓库发布内容仅供学习研究，请勿用于非法或商业用途！ 如因此引起任何法律纠纷，与作者无关！ 没有后门或木马，也不会获取或存储任何信息。 请按照国家法律法规及腾讯的相关原则学习研究！ 我们不对用户的任何下载或任何行为负责。 请下载后24小时内删除！

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
  * [x] 标签管理（支持创建、修改、删除标签）
  * [x] 定时任务（定时消息）
    * 定时消息（支持 “文本、图片、文件、公众号” 配置）
  * [x] 触发任务（消息防撤回、群红包监控、文本消息监控、消息转发）
- 聊天记录备份
  * [x] 还原微信聊天界面（对话列表、查看聊天记录）
    * [x] 支持文本、图片、拍一拍等系统消息
    * [ ] 支持视频、文件、卡片链接、转发消息等
  * [x] 支持 “好友/群聊” 聊天记录备份
    * [x] 支持 Excel 导出
    * [ ] 支持 PDF 导出
- 工具集
  * [x] OCR 文字识别
  * [ ] ...

## 二、使用说明

针对 [wxhelper](https://github.com/ttttupup/wxhelper)、[wechatsdk](https://github.com/WeChatAPIs/wechatAPI) 适配支持。

不同版本，功能可能有所差异，您可以选择适合您的版本（具体细节请参考 [版本使用说明](docs/supported-versions.md)）。

关于如何安装并使用该程序，请参考 [安装及使用说明](docs/getting-started.md)。

## 三、开发手册

* [开发者手册](docs/developer.md)

* [数据库简述](docs/database.md)

## 四、联系我们

[telegram 交流群](https://t.me/wxassistant)

## 五、Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=yzqzy/wechat-assistant&type=Date)](https://star-history.com/#yzqzy/wechat-assistant&Date)



## 六、参考

* [wxhelper](https://github.com/ttttupup/wxhelper) : Hook WeChat / 微信逆向
* [wechatsdk](https://github.com/WeChatAPIs/wechatAPI): 强大的微信 API 工具
* [Injector](https://github.com/nefarius/Injector) : 注入和弹出 DLL
* [WeChatMsg](https://github.com/LC044/WeChatMsg) : 留痕、提取微信聊天记录
