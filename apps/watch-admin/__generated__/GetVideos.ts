/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VideosFilter, VideoType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetVideos
// ====================================================

export interface GetVideos_videos_snippet {
  __typename: "Translation";
  value: string;
}

export interface GetVideos_videos_title {
  __typename: "Translation";
  value: string;
}

export interface GetVideos_videos_seoTitle {
  __typename: "Translation";
  value: string;
}

export interface GetVideos_videos_description {
  __typename: "Translation";
  value: string;
}

export interface GetVideos_videos_variant {
  __typename: "VideoVariant";
  duration: number;
}

export interface GetVideos_videos_episodes {
  __typename: "Video";
  id: string;
  permalink: string;
  noIndex: boolean | null;
}

export interface GetVideos_videos_imageAlt {
  __typename: "Translation";
  value: string;
  primary: boolean;
}

export interface GetVideos_videos {
  __typename: "Video";
  id: string;
  type: VideoType;
  image: string | null;
  snippet: GetVideos_videos_snippet[];
  title: GetVideos_videos_title[];
  seoTitle: GetVideos_videos_seoTitle[];
  description: GetVideos_videos_description[];
  variant: GetVideos_videos_variant | null;
  episodes: GetVideos_videos_episodes[];
  permalink: string;
  noIndex: boolean | null;
  imageAlt: GetVideos_videos_imageAlt[];
  primaryLanguageId: string;
}

export interface GetVideos {
  videos: GetVideos_videos[];
}

export interface GetVideosVariables {
  where?: VideosFilter | null;
  offset?: number | null;
  limit?: number | null;
}
