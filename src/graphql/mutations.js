/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUrl = /* GraphQL */ `
  mutation CreateUrl(
    $input: CreateUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    createUrl(input: $input, condition: $condition) {
      id
      shortUrl
      longUrl
    }
  }
`;
export const updateUrl = /* GraphQL */ `
  mutation UpdateUrl(
    $input: UpdateUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    updateUrl(input: $input, condition: $condition) {
      id
      shortUrl
      longUrl
    }
  }
`;
export const deleteUrl = /* GraphQL */ `
  mutation DeleteUrl(
    $input: DeleteUrlInput!
    $condition: ModelUrlConditionInput
  ) {
    deleteUrl(input: $input, condition: $condition) {
      id
      shortUrl
      longUrl
    }
  }
`;
