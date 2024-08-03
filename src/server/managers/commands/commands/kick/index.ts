import { CommandSender } from "../../types";
import { Command } from "../../utils/command";
import { Player } from "@/game/player";

export class KickCommand extends Command {

    public constructor() {
        super("kick", "Kick a player from the server", ["k"], []);
    }

    public execute(sender: CommandSender, args: string[]): void {
        if (sender instanceof Player) {
            if (args.length < 1) {
                sender.getChatManager().sendMessage("Usage: /kick (player)");
                return;
            }

            const target = args.shift();
            const player = sender.getServer().getPlayersManager().getPlayer(target);

            if (!player) {
                sender.getChatManager().sendMessage(`Player ${target} not found`, true);
                return;
            }

            player.close();
            sender.getChatManager().sendMessage(`Player ${player.getUsername()} has been kicked`);
        }
    }

}
