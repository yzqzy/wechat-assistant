# 获取聊天列表
SELECT chat.strUsrName, chat.nOrder, chat.strNickName, contact.Alias, contact.Remark, contact.NickName, chat.strContent, chat.nMsgType, chat.nMsgLocalId, chat.nMsgStatus, img.smallHeadImgUrl, img.bigHeadImgUrl, chat.nUnReadCount, chat.nTime
FROM
    Session as chat
    INNER JOIN ContactHeadImgUrl as img ON chat.strUsrName = img.usrName
    INNER JOIN Contact as contact ON chat.strUsrName = contact.UserName
ORDER BY nOrder DESC;

# 获取指定时间段的聊天记录
SELECT
    StrTalker,
    localId,
    Type,
    SubType,
    IsSender,
    CreateTime,
    StrContent,
    DisplayContent,
    CompressContent,
    BytesExtra
FROM MSG
WHERE
    TalkerId = (
        SELECT rowid as TalkerId
        FROM Name2ID
        WHERE
            UsrName = 'wxhelper'
    )
    AND CreateTime >= 1710000000
    AND CreateTime <= 1710259199
ORDER BY CreateTime;

# 获取指定用户的聊天记录
SELECT
    StrTalker,
    localId,
    Type,
    SubType,
    IsSender,
    CreateTime,
    StrContent,
    DisplayContent,
    CompressContent,
    BytesExtra
FROM MSG
WHERE
    TalkerId = (
        SELECT rowid as TalkerId
        FROM Name2ID
        WHERE
            UsrName = 'wxhelper'
    )
ORDER BY CreateTime DESC;

# 获取联系人信息
SELECT contact.UserName, contact.Alias, contact.Remark, contact.NickName, img.smallHeadImgUrl, img.bigHeadImgUrl
FROM
    Contact as contact
    INNER JOIN ContactHeadImgUrl as img ON contact.UserName = img.usrName
WHERE
    UserName = 'wxid_wgne4dks02zn12';

# 获取emoji表情地址
select
    case
        when thumburl is NULL
        or thumburl = '' then cdnurl
        else thumburl
    end as selected_url
from CustomEmotion
where
    md5 = 'BBE1B0F763C19F2F4A16E515BBA60596';