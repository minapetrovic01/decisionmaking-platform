import {gql} from 'apollo-server-express';

export const typeDefs = gql`
type Alternative {
  name: String!
  precentage: Float!
  decision: Decision! @relationship(type: "IS_PART_OF", direction: IN) 
}
type Criteria {
  name: String!
  weight: Float!
  decision: Decision! @relationship(type: "DESCRIBES", direction: IN) 
}
type Decision {
  name: String!
  description: String!
  date: DateTime
  alternatives: [Alternative!]! @relationship(type: "IS_PART_OF", direction: OUT)
  criterias: [Criteria!]! @relationship(type: "DESCRIBES", direction: OUT)
  owner: User! @relationship(type: "OWNS", direction: IN)
  tags: [Tag!]! @relationship(type: "HAS", direction: IN)
}
type User {
  username: String!
  name: String!
  surname: String!
  email: String!
  password: String!
  job: String!
  decisions: [Decision!]! @relationship(type: "OWNS", direction: OUT)
}
type Tag {
  name: String!
  decisions: [Decision!]! @relationship(type: "HAS", direction: OUT)
}
`;

