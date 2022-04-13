/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetLanguages
// ====================================================

export interface GetLanguages_languages_name {
  __typename: "Translation";
  primary: boolean;
  value: string;
}

export interface GetLanguages_languages {
  __typename: "Language";
  bcp47: string | null;
  id: string;
  iso3: string | null;
  name: GetLanguages_languages_name[];
}

export interface GetLanguages {
  languages: GetLanguages_languages[];
}
