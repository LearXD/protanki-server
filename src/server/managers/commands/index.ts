import { Player } from "@/game/player";
import { KickCommand } from "./commands/kick";
import { CommandSender } from "./types";
import { Command } from "./utils/command";
import { BonusCommand } from "./commands/bonus";
import { Logger } from "@/utils/logger";
import { AddCryCommand } from "./commands/addcry";
import { AddExpCommand } from "./commands/addexp";
import { DevCommand } from "./commands/dev";

export class CommandsManager {

    public commands: Map<string, Command> = new Map()

    public constructor() {
        this.registerCommands();
    }

    public registerCommands(): void {
        this.registerCommand(new KickCommand())
        this.registerCommand(new BonusCommand())
        this.registerCommand(new AddCryCommand())
        this.registerCommand(new AddExpCommand())
        this.registerCommand(new DevCommand())
    }

    public registerCommand(command: Command): void {
        this.commands.set(command.name, command);
    }

    public unregisterCommand(name: string): void {
        const command = this.commands.get(name);

        if (command) {
            this.commands.delete(command.name);
            command.aliases.forEach(alias => this.commands.delete(alias));
        }
    }

    public getCommand(name: string): Command {
        const command = this.commands.get(name);

        if (command) {
            return command;
        }

        for (const command of this.commands.values()) {
            if (command.aliases.includes(name)) {
                return command;
            }
        }

        return null;
    }

    public handleSendCommand(sender: CommandSender, text: string): boolean {

        const isCommand = text.startsWith(Command.PREFIX)
        if (!isCommand) {
            return false;
        }

        const args = text.slice(Command.PREFIX.length).split(' ');
        const command = args.shift().toLowerCase();

        const instance = this.getCommand(command);
        if (!instance) {
            if (sender instanceof Player) {
                sender.sendMessage(`Command ${command} not found`);
            }
            return true;
        }

        Logger.debug(`Command ${text} executed by ${sender instanceof Player ? sender.getName() : 'Server'}`);
        instance.execute(sender, args);
        return true;
    }
}