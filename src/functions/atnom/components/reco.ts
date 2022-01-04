import { textReply } from "./line";

const checkYoutubeMovie = (url: string): boolean => {
  const youtubeRegExp = new RegExp("^https://youtu.be/[0-9a-zA-Z]{11}$");
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

const checkUrl = (url: string, replyToken: string) => {
  if (checkYoutubeMovie(url)) {
    textReply(replyToken, "Thanks for recommending the Youtube !!");
  } else if (checkTiktokMovie(url)) {
    textReply(replyToken, "Thanks for recommending the Tiktok !!");
  } else if (checkNetflixMovie(url)) {
    textReply(replyToken, "Thanks for recommending the Netflix !!");
  } else {
    textReply(replyToken, "Please reco your favorite !!");
  }
};

const reco = (text: string, replyToken: string) => {
  if (text === "My fav is") {
    textReply(replyToken, "Open Keyboard and Tell me reco !!");
  } else if (text === "someone favs are") {
    //dbからおすすめ動画を3ついい感じに送る
    textReply(replyToken, "test");
  } else {
    //youtube or tiktok or netflixのurlを判定する
    checkUrl(text, replyToken);
  }
};

export { reco };
