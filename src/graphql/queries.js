/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUrl = /* GraphQL */ `
  query GetUrl($id: ID!) {
    getUrl(id: $id) {
      id
      shortUrl
      longUrl
    }
  }
`;
export const listUrls = /* GraphQL */ `
  query ListUrls(
    $filter: ModelUrlFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUrls(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        shortUrl
        longUrl
      }
      nextToken
    }
  }
`;
export const urlByShortUrl = /* GraphQL */ `
  query UrlByShortUrl(
    $shortUrl: String
    $sortDirection: ModelSortDirection
    $filter: ModelUrlFilterInput
    $limit: Int
    $nextToken: String
  ) {
    urlByShortUrl(
      shortUrl: $shortUrl
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        shortUrl
        longUrl
      }
      nextToken
    }
  }
`;
