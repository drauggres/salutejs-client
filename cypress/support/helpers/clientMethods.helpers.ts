import { Server } from 'mock-socket';

import { appendHeader } from '../../../src/assistantSdk/client/protocol';
import { Message, IText } from '../../../src/proto';
import { MessageNames } from '../../../src/typings';

export const createAnswerBuffer = ({
    messageId = 1,
    last = 1,
    systemMessageData,
    messageName,
    text,
}: {
    messageId?: number | Long;
    last?: number;
    systemMessageData?: string;
    messageName?: string;
    text?: IText;
}) => {
    const encodedAsNodeBuffer = appendHeader(
        Message.encode({
            messageId,
            last: last ?? 1,
            systemMessage: systemMessageData ? { data: systemMessageData } : { data: messageId.toString() },
            messageName: messageName || MessageNames.ANSWER_TO_USER,
            text,
        }).finish(),
    );
    const newBuffer = new ArrayBuffer(encodedAsNodeBuffer.byteLength);
    const newBufferView = new Uint8Array(newBuffer);
    newBufferView.set(encodedAsNodeBuffer, 0);
    return newBuffer;
};

export const createServerPong = (server: Server) => {
    server.on('connection', (socket) => {
        socket.binaryType = 'arraybuffer';
        socket.on('message', (ev: Uint8Array) => {
            const message = Message.decode(ev);
            if (!message.initialSettings) {
                const delay = Number(message.text.data);
                setTimeout(() => {
                    socket.send(createAnswerBuffer({ messageId: message.messageId, last: message.last }));
                }, delay);
            }
        });
    });
};
