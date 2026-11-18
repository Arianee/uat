import {WebClient} from '@slack/web-api';
import {createReadStream} from 'fs';
import {basename} from 'path';

export const sendSlackMessage = async (data: {
    message: string,
    channel: string,
    imgPath?: string,
    token: string
}) => {
    const {token, message, channel, imgPath} = data;

    const web = new WebClient(token);

    await web.conversations.join({channel});

    if (imgPath) {
        // files.upload has been retired by Slack: filesUploadV2 posts the message and the screenshot at once.
        return web.filesUploadV2({
            channel_id: channel,
            initial_comment: message,
            file: createReadStream(imgPath),
            filename: basename(imgPath)
        });
    }

    return web.chat.postMessage({
        text: message,
        channel
    });
};
