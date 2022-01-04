import { Client, RichMenu } from "@line/bot-sdk";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { createReadStream } from "fs";
dotenv.config();

const getClient = () => {
  const client = new Client({ channelAccessToken: process.env.ACCESS_TOKEN });
  return client;
};

const signatureValidation = (lineSig: Buffer, header: string) => {
  const signature = crypto
    .createHmac("SHA256", process.env.CHANNEL_SECRET)
    .update(lineSig)
    .digest("base64");
  if (signature === header) {
    return true;
  } else {
    return false;
  }
};

const textReply = (token: string, text: string) => {
  const client = getClient();
  client.replyMessage(token, {
    type: "text",
    text: text,
  });
};

const createRichMenu = async () => {
  const client = getClient();
  const richmenu: RichMenu = {
    size: {
      width: 1200,
      height: 600,
    },
    selected: true,
    name: "atnom",
    chatBarText: "TAP HERE",
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 600,
          height: 600,
        },
        action: {
          type: "message",
          text: "My fav is",
        },
      },
      {
        bounds: {
          x: 600,
          y: 0,
          width: 600,
          height: 600,
        },
        action: {
          type: "message",
          text: "someone favs are",
        },
      },
    ],
  };
  const richMenuId = await client
    .createRichMenu(richmenu)
    .catch((err) => console.log(err));
  if (richMenuId) {
    await client.setRichMenuImage(
      richMenuId,
      createReadStream("src/functions/atnom/images/richMenu.png")
    );
    await client.setDefaultRichMenu(richMenuId);
  }
};

const deleteRichMenu = async () => {
  const client = getClient();
  const richMenuId = await client.getDefaultRichMenuId();
  await client.deleteDefaultRichMenu();
  await client.deleteRichMenu(richMenuId);
};

const resetRichMenu = async () => {
  await deleteRichMenu();
  await createRichMenu();
};

export { signatureValidation, textReply, resetRichMenu };
