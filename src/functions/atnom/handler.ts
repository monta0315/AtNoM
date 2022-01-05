import {
  format200JSONResponse,
  format500JSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { flexReply, signatureValidation } from "./components/line";
import schema from "./schema";

const components = [
  {
    videoUrl: "https://youtu.be/ID74QtPAlEM",
    imageUrl: "https://img.youtube.com/vi/oOZWhZJYNxQ/maxres1.jpg",
    name: "monta",
    title: "test",
    type: "youtube",
  },
  {
    videoUrl: "https://youtu.be/ZBQ0ae9bFsc",
    imageUrl: "https://img.youtube.com/vi/oOZWhZJYNxQ/maxres1.jpg",
    name: "monta",
    title: "test",
    type: "youtube",
  },
  {
    videoUrl: "https://youtu.be/oOZWhZJYNxQ",
    imageUrl: "https://img.youtube.com/vi/oOZWhZJYNxQ/maxres1.jpg",
    name: "monta",
    title: "test",
    type: "youtube",
  },
];

const atnom: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  if (
    signatureValidation(
      Buffer.from(JSON.stringify(event.body)),
      event["headers"]["x-line-signature"]
    )
  ) {
    if (event.body.events.length) {
      // validationチェック用のリクエストではない場合
      /* textReply(
        event.body.events[0].replyToken,
        event.body.events[0].message.text
      ); */
      const replyToken = event.body.events[0].replyToken;
      const text = event.body.events[0].message.text;
      console.log(text);
      flexReply(replyToken, components);
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
