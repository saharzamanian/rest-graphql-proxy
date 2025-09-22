export const GET_ITEMS = /* GraphQL */ `
  query GetItems {
    getItems {
      id
      mandatoryString
      optionalBoolean
    }
  }
`;

export const GET_ITEM = /* GraphQL */ `
  query GetItem($id: ID!) {
    getItem(id: $id) {
      id
      mandatoryString
      optionalBoolean
    }
  }
`;