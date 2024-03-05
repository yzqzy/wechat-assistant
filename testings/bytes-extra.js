import protobuf from 'protobufjs'

const bytesExtra =
  'CgQIEBAAGhcIARITd3hpZF9oNGlmb2gyNHM0c2IyMhqlAggHEqACPG1zZ3NvdXJjZT4KICAgIDxzZWNfbXNnX25vZGU+CiAgICAgICAgPGFsbm9kZT4KICAgICAgICAgICAgPGZyPjE8L2ZyPgogICAgICAgIDwvYWxub2RlPgogICAgPC9zZWNfbXNnX25vZGU+CiAgICA8c2lsZW5jZT4xPC9zaWxlbmNlPgogICAgPG1lbWJlcmNvdW50PjE5PC9tZW1iZXJjb3VudD4KICAgIDxzaWduYXR1cmU+VjFfcm5yLzdQRUZ8djFfcm5yLzdQRUY8L3NpZ25hdHVyZT4KICAgIDx0bXBfbm9kZT4KICAgICAgICA8cHVibGlzaGVyLWlkIC8+CiAgICA8L3RtcF9ub2RlPgo8L21zZ3NvdXJjZT4KGiQIAhIgM2M4ZTJjZDg1OTlhMTYxZTczNjMyMzg2NTQzYTRmMTY='

const root = protobuf.parse(`
  syntax = "proto3";
  package app.protobuf;
  option go_package=".;proto";
  
  message SubMessage1 {
    int32 field1 = 1;
    int32 field2 = 2;
  }
  
  message SubMessage2 {
    int32 field1 = 1;
    string field2 = 2;
  }
  
  message MessageBytesExtra {
    SubMessage1 message1 = 1;
    repeated SubMessage2 message2 = 3;
  }
`).root

const MessageType = root.lookupType('MessageBytesExtra')
const buffer = Buffer.from(bytesExtra, 'base64')
const message = MessageType.decode(buffer)

const decodedData = MessageType.toObject(message, {
  longs: Number,
  enums: String,
  bytes: Array
})

console.log(decodedData)
