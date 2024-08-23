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
            const battle = sender.battle

            if (!battle) {
                sender.sendMessage("Você não está em uma batalha.");
                return;
            }

            if (args.length < 1) {
                sender.sendMessage("Uso correto: /bonus (gold) (delay: default = 0s)");
                return;
            }

            const bonus = args.shift() as BonusType;
            const delay = parseInt(args.shift() || "0");

            if (!BattleBoxesManager.CONFIG.find(b => b.type === bonus)) {
                sender.sendMessage("Tipo de bônus inválido.");
                return;
            }

            const spawned = battle.boxesManager.spawnBox(bonus, delay);

            if (!spawned) {
                sender.sendMessage("Não foi possível criar o bônus.");
                return;
            }

            sender.sendMessage("Bônus criado.");
        }
    }

}
