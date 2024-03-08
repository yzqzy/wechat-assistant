import convert from 'xml-js'

const xmlData = `<msg><emoji fromusername = "wxid_wgne4dks02zn12" tousername = "44551008263@chatroom" type="2" idbuffer="media:0_0" md5="05734607cd777042d448193605b07b8f" len = "55990" productid="" androidmd5="05734607cd777042d448193605b07b8f" androidlen="55990" s60v3md5 = "05734607cd777042d448193605b07b8f" s60v3len="55990" s60v5md5 = "05734607cd777042d448193605b07b8f" s60v5len="55990" cdnurl = "http://vweixinf.tc.qq.com/110/20401/stodownload?m=05734607cd777042d448193605b07b8f&amp;filekey=30440201010430302e02016e0402534804203035373334363037636437373730343264343438313933363035623037623866020300dab6040d00000004627466730000000131&amp;hy=SH&amp;storeid=323032323033303431353231323930303030386438303430333561333365626636666234306230303030303036653031303034666231&amp;ef=1&amp;bizid=1022" designerid = "" thumburl = "" encrypturl = "http://vweixinf.tc.qq.com/110/20402/stodownload?m=bff08fcc8a9ee4bcea362d66da4402f7&amp;filekey=30440201010430302e02016e0402534804206266663038666363386139656534626365613336326436366461343430326637020300dac0040d00000004627466730000000131&amp;hy=SH&amp;storeid=323032323033303431353231323930303031633635613430333561333365626636666234306230303030303036653032303034666232&amp;ef=2&amp;bizid=1022" aeskey= "b9ccd2fb68974c01bb1cc7ebede8ca9b" externurl = "http://vweixinf.tc.qq.com/110/20403/stodownload?m=532ac072a3cab81aeb31bdce200ae08f&amp;filekey=3043020101042f302d02016e040253480420353332616330373261336361623831616562333162646365323030616530386602022600040d00000004627466730000000131&amp;hy=SH&amp;storeid=323032323033303431353231323930303033303761363430333561333365626636666234306230303030303036653033303034666233&amp;ef=3&amp;bizid=1022" externmd5 = "9f65d5bea87b3d15bd9c601fe0a3e2bc" width= "160" height= "160" tpurl= "" tpauthkey= "" attachedtext= "" attachedtextcolor= "" lensid= "" emojiattr= "" linkid= "" desc= "" ></emoji> <gameext type="0" content="0" ></gameext></msg>`

const result = convert.xml2json(xmlData, { compact: true, spaces: 4 })

console.log(typeof result, JSON.parse(result))
