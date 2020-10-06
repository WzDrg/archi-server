import gql from 'graphql-tag';

export default gql`
scalar Date

enum ItemType {
    ACTOR
    SOFTWARESYSTEM
    CONTAINER
    COMPONENT
    SERVER
    CONTAINERINSTANCE
}

type Reference {
    type: ItemType
    name: String
}

type Query {
    softwareSystems(until:Date): [SoftwareSystem]
    environments(until:Date): [Environment]
    stories: [Story]
}

type SoftwareSystem {
    id: String
    name: String
    containers: [Container]
    uses: [Reference]
}

type Container {
    id: String
    name: String
    uses: [Reference]
}

type ContainerInstance {
    name: String
    container: Container
    uses: [Reference]
}

type Server {
    id: String
    name: String
    containers: [ContainerInstance]
}

type Environment {
    name: String
    servers: [Server]
}

type Story { 
    name: String
    content: String
}

schema {
    query: Query
}
`