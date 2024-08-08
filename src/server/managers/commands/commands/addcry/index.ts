import { Player } from "@/game/player";
import { CommandSender } from "../../types";
import { Command } from "../../utils/command";
import { PlayerData } from "@/game/player/utils/data";
export class AddCryCommand extends Command {

    public constructor() {
        super("addcry", "Adiciona cristais ao jogador");
    }

    public execute(sender: CommandSender, args: string[]): void {
        if (sender instanceof Player) {
            if (args.length < 1) {
                sender.sendMessage("Uso correto: /addcry (quantidade) (jogador?)");
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

            data.increaseCrystals(amount, false);
            sender.sendMessage(`Você adicionou ${amount} cristais ao jogador ${data.username}.`);
        }
    }

}
