import { ChatModeratorLevel } from "@/states/chat-moderator-level";
import { CommandSender } from "../../types";
import { Player } from "@/game/player";
import { Logger } from "@/utils/logger";

export abstract class Command {

    public static readonly PREFIX = "/";

    public constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly aliases: string[] = [],
        public readonly permissions: ChatModeratorLevel[] = [ChatModeratorLevel.NONE],
    ) { }

    public hasPermission(level: ChatModeratorLevel): boolean {
        return this.permissions.includes(level);
    }

    public abstract execute(sender: CommandSender, args: string[]): void;

}