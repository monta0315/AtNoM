import { getDbData, store } from "./db";
import { flexReply, getUserName, textReply } from "./line";

const checkYoutubeMovie = (url: string): boolean => {
  const youtubeRegExp = new RegExp("^https://youtu.be/[0-9a-zA-Z-]{11}$");
  return youtubeRegExp.test(url);
};

const checkTiktokMovie = (url: string) => {
  const tiktokRegExp = new RegExp("^https://vt.tiktok.com/[0-9a-zA-Z]{9}/$");
  return tiktokRegExp.test(url);
};

const checkNetflixMovie = (url: string) => {
  const netflixRegExp = new RegExp(
    "^https://www.netflix.com/title/[0-9]{8}?s=i&trkid=[0-9]{8}"
  );
  return netflixRegExp.test(url);
};

const getYoutubeId = (url: string): string => {
  const youtubeIdRegExp = new RegExp("[0-9a-zA-Z-]{11}");
  return youtubeIdRegExp.exec(url)[0];
};

const checkUrl = async (url: string, replyToken: string, name: string) => {
  if (checkYoutubeMovie(url)) {
    await store(getYoutubeId(url), name, "youtube");
    textReply(replyToken, "Thanks for recommending the Youtube !!");
  } else if (checkTiktokMovie(url)) {
    textReply(replyToken, "Thanks for recommending the Tiktok !!");
  } else if (checkNetflixMovie(url)) {
    textReply(replyToken, "Thanks for recommending the Netflix !!");
  } else {
    textReply(replyToken, "Please reco your favorite !!");
  }
};

const reco = async (text: string, replyToken: string, userId: string) => {
  if (text === "My fav is") {
    textReply(replyToken, "Open Keyboard and Tell me reco !!");
  } else if (text === "someone favs are") {
    //dbからおすすめ動画を3ついい感じに送る
    const dbData: any = await getDbData();
    if (dbData.length === 0) {
      textReply(replyToken, "something wrong");
    } else {
      flexReply(replyToken, dbData);
    }
  } else {
    //youtube or tiktok or netflixのurlを判定する
    const userName = await getUserName(userId);
    await checkUrl(text, replyToken, userName);
  }
};

export { reco };
