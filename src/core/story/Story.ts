export interface StoryUses {
    type?: string;
}

export interface StoryContainer {
    description: string;
    type: string;
    uses?: Record<string, StoryUses>;
}

export interface StorySoftwareSystem {
    description?: string;
    containers: Record<string, StoryContainer>;
    uses?: Record<string, StoryUses>;
}

export interface StoryCommunication {
    protocol?: string;
    type?: string;
}

export interface StoryContainerInstance {
    container?: string;
    location?: string;
    uses?: Record<string, StoryCommunication>;
}

export interface StoryServer {
    description?: string;
    os?: string;
    tier?: number;
    datacenter?: string;
    cpu?: number;
    memory?: string;
    containers?: Record<string, StoryContainerInstance>;
}

export interface StoryEnvironment {
    servers: Record<string, StoryServer>;
}

export type StoryId = string;

export interface NewStory {
    name: string;
    description: string;
    date: Date;
    context: string;
    environments?: Record<string, StoryEnvironment>;
    softwareSystems?: Record<string, StorySoftwareSystem>;
}

export interface Story extends NewStory {
    id: StoryId;
}
