const {WebClient} = require('@slack/web-api');
const {createReadStream} = require('fs');

export const sendSlackMessage = async (data: {
    message: string,
    channel: string,
    imgPath?: string,
    token: string
}) => {
    const {token, message, channel, imgPath} = data;

    const web = new WebClient(token);


    await web.conversations.join({channel});

    let attachments;
    if (imgPath) {
        const result = await web.files.upload(
            {
                channels: channel,
                file: createReadStream(imgPath),
            });

        attachments = [
            {
                text: 'screenshot of your error',
                image_url: result.file.permalink
            }
        ];
    }

    return web.chat.postMessage({
        text: message,
        channel,
        attachments
    });
};
