const videoId = "oOZWhZJYNxQ";
import axios from "axios";

const getTitle = async (videoId: string) => {
  const test = await axios.get(
    `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
  );
  console.log(test.data.title);
};

getTitle(videoId);
