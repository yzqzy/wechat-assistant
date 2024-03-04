# 获取聊天列表
SELECT chat.strUsrName, chat.nOrder, chat.strNickName, contact.Alias, contact.Remark, contact.NickName, chat.strContent, chat.nMsgType, chat.nMsgLocalId, chat.nMsgStatus, img.smallHeadImgUrl, img.bigHeadImgUrl, chat.nUnReadCount, chat.nTime
FROM
    Session as chat
    INNER JOIN ContactHeadImgUrl as img ON chat.strUsrName = img.usrName
    INNER JOIN Contact as contact ON chat.strUsrName = contact.UserName
ORDER BY nOrder DESC;