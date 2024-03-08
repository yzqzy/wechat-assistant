import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser()

const xmlData = `<sysmsg type=\"revokemsg\"><revokemsg><session>44994517948@chatroom</session><msgid>1607762428</msgid><newmsgid>3918292996776605209</newmsgid><replacemsg><![CDATA[\"heora\" 鎾ゅ 
洖浜嗕竴鏉℃秷鎭痌]></replacemsg><announcement_id><![CDATA[]]></announcement_id></revokemsg></sysmsg>","createTime":1707119881,"displayFullContent":"","fromUser":"44994517948@chatroom","msgId":3443711041028851504,"msgSequence":863099882,"pid":13656,"signature":"<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n","toUser":"wxid_3w0lupg9j01622","type":10002}`

const parsedData = parser.parse(xmlData)

console.log(parsedData)
