import gql from 'graphql-tag';

export default gql`
enum ItemType {
    ACTOR
    SOFTWARESYSTEM
    CONTAINER
    COMPONENT
}

type Reference {
    type: ItemType
    name: String
}

type Query {
    softwareSystems: [SoftwareSystem]
    environments: [Environment]
}

type SoftwareSystem {
    name: String
    containers: [Container]
    uses: [Reference]
}

type Container {
    name: String
    uses: [Reference]
}

type ContainerInstance {
    name: String
    container: Container
    uses: [Reference]
}

type Server {
    name: String
    containers: [ContainerInstance]
}

type Environment {
    name: String
    servers: [Server]
}

schema {
    query: Query
}
`