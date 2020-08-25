import { Story } from "../../src/story/story";
import { AggregateType } from "../../src/repository/types";
import { memoryEventStore } from "../../src/repository/MemoryEventStore";
import { appendStoryToEventStore } from "../../src/session/StoryAppender";
import { getAggregates } from "../../src/repository/AggregateBuilder";

describe("appendStory", () => {
    it("should convert empty story", () => {
        const event_store = memoryEventStore();
        const story: Story = {
            description: "Simple story",
            context: "Document Generation",
            date: new Date(2020, 7, 5),
            environments: {}
        }
        const result = appendStoryToEventStore(event_store)(story);
        expect(result.size()).toEqual(0);
    });

    it("should convert a simple story", () => {
        const event_store = memoryEventStore();
        const story: Story = {
            description: "Simple story",
            context: "Document Generation",
            date: new Date(2020, 7, 5),
            environments: {
                "TST": {
                    "servers": {
                        "hn005": {
                            description: "My server"
                        }
                    }
                }
            }
        }
        const result = appendStoryToEventStore(event_store)(story);
        expect(result.size()).toEqual(1);
        expect(getAggregates(event_store)(AggregateType.Server)).toHaveLength(1);
    });

    it("should convert the archiving service", () => {
        const event_store = memoryEventStore();
        const story: Story = {
            description: "Archiving service",
            date: new Date(2020, 7, 11),
            context: "Document Archiving",
            softwareSystems: {
                "Document Archiving": {
                    description: "Provides long term storage of documents",
                    containers: {
                        "Quickfile UI": {
                            description: "User interface of the Quick File application",
                            type: "application"
                        },
                        "Quickfile API": {
                            description: "REST API to store documents",
                            type: "storage",
                            uses: {
                                "Local disk storage": {
                                    type: "Container"
                                },
                                "ECS": {
                                    type: "Container"
                                },
                            }
                        },
                        "Local disk storage": {
                            description: "Document storage using mounted disk volumes",
                            type: "storage"
                        },
                        "QF3": {
                            description: "Oracle database containing the Quickfile metadata",
                            type: "storage"
                        },
                        "ECS": {
                            description: "Dell storage",
                            type: "storage"
                        },
                        "Document Archiving Service": {
                            description: "Business service to archive documents",
                            type: "application",
                            uses: {
                                "Quickfile API": {
                                    type: "container"
                                }
                            }
                        }
                    }
                }
            },
            environments: {
                ACC: {
                    servers: {
                        HN306: {
                            containers: {
                                "Quickfile API": {
                                    container: "Quickfile API"
                                }
                            }
                        }
                    }
                },
                EXP: {
                    servers: {
                        HN206: {
                            containers: {
                                "Quickfile API": {
                                    container: "Quickfile API"
                                }
                            }
                        }
                    }
                }
            }
        };
        const result = appendStoryToEventStore(event_store)(story);
        expect(result.size()).toEqual(14);
        expect(getAggregates(event_store)(AggregateType.Server)).toHaveLength(2);
    })
});