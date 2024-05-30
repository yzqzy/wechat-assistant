import protobuf from 'protobufjs'

export const msgBytesExtraParser = (extra: string) => {
  const { root } = protobuf.parse(`
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
  `)
  const MessageType = root.lookupType('MessageBytesExtra')
  const buffer = Buffer.from(extra, 'hex')
  const message = MessageType.decode(buffer)
  const decodedData = MessageType.toObject(message, {
    longs: Number,
    enums: String,
    bytes: Array
  })
  return decodedData
}
