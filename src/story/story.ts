export interface Uses {
    type?: string;
}

export interface Container {
    description: string;
    type: string;
    uses?: Record<string, Uses>;
}

export interface SoftwareSystem {
    description?: string;
    containers: Record<string, Container>;
    uses?: Record<string, Uses>;
}

export interface Communication {
    protocol?: string;
    type?: string;
}

export interface ContainerInstance {
    container?: string;
    location?: string;
    uses?: Record<string, Communication>;
}

export interface Server {
    description?: string;
    os?: string;
    tier?: number;
    datacenter?: string;
    cpu?: number;
    memory?: string;
    containers?: Record<string, ContainerInstance>;
}

export interface Environment {
    servers: Record<string, Server>;
}

export interface Story {
    description: string;
    date: Date;
    context: string;
    environments?: Record<string, Environment>;
    softwareSystems?: Record<string, SoftwareSystem>;
}