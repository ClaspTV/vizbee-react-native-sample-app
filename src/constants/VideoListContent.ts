import { VideoItem } from "../types/VideoItem";

export const videos: VideoItem[] = [
  {
    guid: "elephants",
    title: "Elephants Dream",
    subtitle: "Free HLS video",
    imageUrl:
      "https://s3.amazonaws.com/vizbee/images/demoapp/elephants_dream.jpg",
    isLive: false,
    streamUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/hls/ElephantsDream.m3u8",
  },
  {
    guid: "tears",
    title: "Tears of Steel",
    subtitle:
      "Thousands of years ago, five African tribes war over a meteorite containing the metal vibranium. One warrior ingests a heart-shaped herb affected by the metal and gains superhuman abilities, becoming the first Black Panther.",
    imageUrl:
      "https://s3.amazonaws.com/vizbee/images/demoapp/20732e42e9cec9dcf99dc305cb6615e3.jpg",
    isLive: false,
    streamUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/hls/TearsOfSteel.m3u8",
  },
  {
    guid: "akamai-live-stream",
    title: "Akamai Live Stream",
    subtitle:
      "In 1947, John Nash arrives at Princeton University as a co-recipient, with Martin Hansen, of the Carnegie Scholarship for Mathematics",
    imageUrl:
      "https://images.unsplash.com/photo-1604311795833-25e1d5c128c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80",
    isLive: true,
    streamUrl:
      "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
  },
  {
    guid: "no-subtitle",
    title: "Video with no subtitle",
    imageUrl:
      "https://images.pexels.com/photos/4482677/pexels-photo-4482677.jpeg?auto=compress&cs=tinysrgb&w=800",
    isLive: false,
    streamUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/hls/ElephantsDream.m3u8",
  },
  {
    guid: "no-title-subtitle",
    imageUrl:
      "https://s3.amazonaws.com/vizbee/images/demoapp/20732e42e9cec9dcf99dc305cb6615e3.jpg",
    isLive: false,
    streamUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/hls/TearsOfSteel.m3u8",
  },
  {
    title: "Fake Video with Bad URL",
    subtitle: "Won't play on TV",
    guid: "fake",
    imageUrl:
      "https://s-media-cache-ak0.pinimg.com/originals/fa/47/54/fa475423da097d624d75d49a79d8e140.jpg",
    isLive: false,
    streamUrl: "http://vizbee.tv/does-not-exist.m3u8",
    genre: "Crime Comedy",
  },
  {
    title: "URL Throws Error After 1min",
    guid: "throw-error",
    imageUrl: "",
    isLive: false,
    streamUrl:
      "https://content.claspws.tv/hls-samples/mid-stream-error/manifest.m3u8",
    genre: "Crime Comedy",
  },
];
