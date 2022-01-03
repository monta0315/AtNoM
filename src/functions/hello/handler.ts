import {
  format200JSONResponse,
  format500JSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { Client } from "@line/bot-sdk";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import schema from "./schema";
dotenv.config();
const secret = process.env.CHANNEL_SECRET;
const token = process.env.ACCESS_TOKEN;

const getClient = () => {
  const client = new Client({ channelAccessToken: token });
  return client;
};

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log(event.body);
  const signature = crypto
    .createHmac("SHA256", secret)
    .update(Buffer.from(JSON.stringify(event.body)))
    .digest("base64");

  const checkHeader = event["headers"]["x-line-signature"];
  console.log("created_signature", signature);
  console.log("header_signature", checkHeader);
  const client = getClient();
  if (signature === checkHeader) {
    if (event.body.events.length !== 0) {
      const text = event.body.events[0].message.text;
      client.replyMessage(event.body.events[0].replyToken, {
        type: "text",
        text: text,
      });
      return format200JSONResponse({
        message: "test",
        event,
      });
    } else {
      return format200JSONResponse({
        message: "test",
        event,
      });
    }
  } else {
    return format500JSONResponse({
      message: "test",
      event,
    });
  }
};

export const main = middyfy(hello);
