# WeChat Assistant

PC 微信助手，基于 Electron、WeChat Hook 实现。

> 本仓库发布内容仅供学习研究，请勿用于非法或商业用途！ 如因此引起任何法律纠纷，与作者无关！ 没有后门或木马，也不会获取或存储任何信息。 请按照国家法律法规及腾讯的相关原则学习研究！ 我们不对用户的任何下载或任何行为负责。 请下载后24小时内删除！

## 一、功能一览

- 联系人管理
  *	[x] 发送 “文本、图片、文件” 消息
  * [x] 支持群发消息
  *	[x] 查看联系人列表、导出联系人列表
- 任务管理
  * [x] 定时任务（定时消息）
    * 定时消息（支持 “文本、图片、文件、公众号” 配置）
  * [x] 触发任务（消息防撤回、文本消息监控、消息转发）
- 聊天记录备份
  * [x] 还原微信聊天界面（对话列表、查看聊天记录）
    * [x] 支持文本、图片、拍一拍等系统消息
    * [ ] 支持视频、文件、卡片链接、转发消息等
  * [x] 支持 “好友/群聊” 聊天记录备份
    * [x] 支持 Excel 导出
    * [ ] 支持 PDF 导出

## 二、使用说明

[安装及使用说明](docs/getting-started.md)

[聊天记录迁移说明](docs/chat-history-migration.md)

> 使用聊天记录备份功能需要首先将手机/平板的聊天记录迁移到电脑上，否则看到的不是完整记录。

## 三、开发手册

[开发者手册](docs/developer.md)

[数据库简述](docs/database.md)

## 四、Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=yzqzy/wechat-assistant&type=Date)](https://star-history.com/#yzqzy/wechat-assistant&Date)

## 五、参考

* [wxhelper](https://github.com/ttttupup/wxhelper) : Hook WeChat / 微信逆向
* [Injector](https://github.com/nefarius/Injector) : 注入和弹出 DLL
* [WeChatMsg](https://github.com/LC044/WeChatMsg) : 留痕、提取微信聊天记录
