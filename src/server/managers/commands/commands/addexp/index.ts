import { Player } from "@/game/player";
import { CommandSender } from "../../types";
import { Command } from "../../utils/command";
import { PlayerData } from "@/game/player/utils/data";

export class AddExpCommand extends Command {

    public constructor() {
        super("addexp", "Adiciona experiência ao jogador");
    }

    public execute(sender: CommandSender, args: string[]): void {
        if (sender instanceof Player) {
            if (args.length < 1) {
                sender.sendMessage("Uso correto: /addxp (quantidade) (jogador?)");
                return;
            }

            const amount = parseInt(args.shift());

            if (isNaN(amount)) {
                sender.sendMessage("Quantidade inválida.");
                return;
            }

            const data = args.length > 1 ? PlayerData.findPlayerData(args.shift()) : sender.data;
            if (!data) {
                sender.sendMessage("Jogador não encontrado.");
                return;
            }

            data.addExperience(amount, false);
            sender.sendMessage(`Você adicionou ${amount} de exp ao jogador ${data.username}.`);
        }
    }

}
