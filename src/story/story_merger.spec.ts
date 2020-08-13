import { Story } from "./story";
import { fromStory } from "./story_merger";
import { AggregateType } from "../core/types";

describe("storiesToCommands", () => {
    it("should convert empty story", () => {
        const story: Story = {
            description: "Simple story",
            context: "Document Generation",
            date: new Date(2020, 7, 5),
            environments: {}
        }
        const commands = fromStory(story);
        expect(commands).toHaveLength(0);
    });

    it("should convert a simple story", () => {
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
        const commands = fromStory(story);
        expect(commands).toHaveLength(1);
        expect(commands[0]).toHaveProperty("id");
        expect(commands[0].id).toHaveProperty("type", AggregateType.Server);
        expect(commands[0].id).toHaveProperty("id", "hn005");
    });

    it("should convert the archiving service", () => {
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
        const commands = fromStory(story);
        //        commands.forEach(command => console.log(command.id.id));
        expect(commands).toHaveLength(14);
    })
});