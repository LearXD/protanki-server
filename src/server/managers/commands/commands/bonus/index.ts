import { Player } from "@/game/player";
import { CommandSender } from "../../types";
import { Command } from "../../utils/command";
import { BattleBoxesManager } from "@/game/battle/managers/boxes";
import { BonusType } from "@/game/map/types";

export class BonusCommand extends Command {

    public constructor() {
        super("bonus", "");
    }

    public execute(sender: CommandSender, args: string[]): void {
        if (sender instanceof Player) {
            const battle = sender.getBattle();

            if (!battle) {
                sender.sendMessage("Você não está em uma batalha.");
                return;
            }

            if (args.length < 1) {
                sender.sendMessage("Uso correto: /bonus (gold) (delay: default = 0s)");
                sender.sendMessage("Tipos de bônus: " + BattleBoxesManager.availableBonuses.join(", ") + ".");
                return;
            }

            const bonus = args.shift() as BonusType;
            const delay = parseInt(args.shift() || "0");

            if (!BattleBoxesManager.availableBonuses.includes(bonus)) {
                sender.sendMessage("Tipo de bônus inválido.");
                return;
            }

            const spawned = battle.getBoxesManager().spawnBox(bonus, delay);

            if (!spawned) {
                sender.sendMessage("Não foi possível criar o bônus.");
                return;
            }

            sender.sendMessage("Bônus criado.");
        }
    }

}
