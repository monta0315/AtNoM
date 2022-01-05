import * as AWS from "aws-sdk";
import axios from "axios";
import { messageComponent } from "./flexMassege";

AWS.config.update({
  region: "ap-northeast-1",
});

const getVideoUrl = (videoId: string, type: string) => {
  if (type === "youtube") {
    return `https://youtu.be/${videoId}`;
  } else {
    return "test";
  }
};

const getImageUrl = (videoId: string, type: string) => {
  if (type === "youtube") {
    return `https://img.youtube.com/vi/${videoId}/maxres1.jpg`;
  } else {
    return "test";
  }
};

const getTitle = async (videoId: string, type: string) => {
  if (type === "youtube") {
    const data = await axios.get(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    return data.data.title;
  } else {
    return "test";
  }
};

const store = async (videoId: string, name: string, type: string) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const imageUrl = getImageUrl(videoId, type);
  const videoUrl = getVideoUrl(videoId, type);
  const title = await getTitle(videoId, type);
  let information;
  if (type === "youtube") {
    information = {
      TableName: "youtubeVideoTable",
      Item: {
        videoUrl: videoUrl,
        imageUrl: imageUrl,
        name: name,
        title: title,
        type: type,
      },
    };
  }
  await documentClient
    .put(information)
    .promise()
    .then(() => console.log("Write is OK"))
    .catch((err) => console.log(err));
};

//store("ID74QtPAlEM", "monta", "youtube");

const getDbData = async () => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const data = {
    TableName: "youtubeVideoTable",
  };
  let re: messageComponent[] = [];
  await documentClient
    .scan(data)
    .promise()
    .then((result) => {
      result.Items.forEach((i: messageComponent) => {
        re.push(i);
      });
    })
    .catch((err) => console.log(err));

  return re;
};

export { store, getDbData };
