/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTags
// ====================================================

export interface GetTags_videoTags_title {
  __typename: "Translation";
  value: string;
}

export interface GetTags_videoTags {
  __typename: "VideoTag";
  id: string;
  title: GetTags_videoTags_title[];
}

export interface GetTags {
  videoTags: GetTags_videoTags[] | null;
}
