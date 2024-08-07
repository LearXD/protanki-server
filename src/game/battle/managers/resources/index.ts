import { ServerError } from "@/server/utils/error";
import { Battle } from "../..";
import { SetBattleMapPropertiesPacket } from "../../../../network/packets/set-battle-map-properties";
import { SetTurretsDataPacket } from "../../../../network/packets/set-turrets-data";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";

export class BattleResourcesManager {

    public constructor(
        private readonly battle: Battle
    ) { }


    public sendTurretsData(player: Player) {
        const turrets = player.server.battleManager.getData('turrets.json')

        if (!turrets) {
            throw new ServerError('Turrets data not found')
        }

        const setTurretsDataPacket = new SetTurretsDataPacket();
        setTurretsDataPacket.turrets = turrets;
        player.sendPacket(setTurretsDataPacket);
    }
}