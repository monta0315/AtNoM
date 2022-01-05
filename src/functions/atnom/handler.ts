import {
  format200JSONResponse,
  format500JSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { signatureValidation } from "./components/line";
import { reco } from "./components/reco";
import schema from "./schema";

const atnom: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log("test", event);
  event.resource;
  if (
    signatureValidation(
      Buffer.from(JSON.stringify(event.body)),
      event["headers"]["x-line-signature"]
    )
  ) {
    if (event.body.events.length) {
      // validationチェック用のリクエストではない場合
      const replyToken = event.body.events[0].replyToken;
      const text = event.body.events[0].message.text;
      const userId = event.body.events[0].source.userId;
      await reco(text, replyToken, userId);
      return format200JSONResponse({
        message: "success",
      });
    } else {
      // validationチェック用
      return format200JSONResponse({
        message: "success",
      });
    }
  } else {
    return format500JSONResponse({
      message: "false",
    });
  }
};

export const main = middyfy(atnom);
