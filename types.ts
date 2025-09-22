
export enum ContentType {
  YOUTUBE = "YouTube Explainer Video (5-7 min)",
  TIKTOK = "TikTok/Reels Short (30-60 sec)",
  PODCAST = "Podcast Episode (15-20 min)",
  BLOG = "Blog Post / Article Outline (Approx. 1000 words)",
  INSTAGRAM = "Instagram Story Series (3-5 frames)",
}

export interface MediaLink {
  description: string;
  url: string;
}

export interface ScriptSegment {
  segmentTitle: string;
  talkingPoints: string[];
  mediaLinks: MediaLink[];
}

export interface ContentPackage {
  titles: string[];
  script: ScriptSegment[];
}
