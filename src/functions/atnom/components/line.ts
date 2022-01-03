import { Client } from "@line/bot-sdk";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
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

export { signatureValidation, textReply };
