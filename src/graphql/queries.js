/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserinfo = /* GraphQL */ `
  query GetUserinfo($id: ID!) {
    getUserinfo(id: $id) {
      id
      name
      createdAt
      followings_count
      follower_count
      friends
      trips
      used
      raw
      updatedAt
    }
  }
`;
export const listUserinfos = /* GraphQL */ `
  query ListUserinfos(
    $filter: ModelUserinfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserinfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        followings_count
        follower_count
        friends
        trips
        used
        raw
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByOrder = /* GraphQL */ `
  query UserByOrder(
    $createdAt: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserinfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByOrder(
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        createdAt
        followings_count
        follower_count
        friends
        trips
        used
        raw
        updatedAt
      }
      nextToken
    }
  }
`;
