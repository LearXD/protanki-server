export class ChatModeratorLevel {

    static readonly NONE = "NONE"
    static readonly COMMUNITY_MANAGER = "COMMUNITY_MANAGER"
    static readonly ADMINISTRATOR = "ADMINISTRATOR"
    static readonly MODERATOR = "MODERATOR"
    static readonly CANDIDATE = "CANDIDATE"

    static readonly LEVELS = [
        ChatModeratorLevel.NONE,
        ChatModeratorLevel.COMMUNITY_MANAGER,
        ChatModeratorLevel.ADMINISTRATOR,
        ChatModeratorLevel.MODERATOR,
        ChatModeratorLevel.CANDIDATE
    ]
}

export type ChatModeratorLevelType = "NONE" | "COMMUNITY_MANAGER" | "ADMINISTRATOR" | "MODERATOR" | "CANDIDATE"