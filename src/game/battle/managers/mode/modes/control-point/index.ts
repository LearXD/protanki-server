import { Player } from "@/game/player";
import { SetLoadControlPointPacket } from "@/network/packets/set-load-control-point";
import { Vector3d } from "@/utils/vector-3d";
import { BattleTeamModeManager } from "../team/team";
import { IMapSpawn } from "@/game/map/types";

export class BattleControlPointsModeManager extends BattleTeamModeManager {

    public init(): void { }

    public getRandomSpawn(player: Player): IMapSpawn {
        return null
    }


    public sendLoadBattleMode(player: Player): void {
        const packet = new SetLoadControlPointPacket();
        packet.float_1 = 10
        packet.float_2 = 500
        packet.float_3 = 5
        packet.controlPoints = [
            {
                id: 0,
                name: 'A',
                position: new Vector3d(500, 300, 500),
                score: 0,
                float_1: 0,
                state: 'NEUTRAL',
                strings_1: []
            }
        ]
        packet.resources = {
            image_1: 150231,
            image_2: 102373,
            image_3: 915688,
            image_4: 560829,
            image_5: 546583,
            image_6: 982573,
            image_7: 298097,
            model: 992320,
            image_8: 474249,
            image_9: 199168,
            image_10: 217165,
            image_11: 370093
        }
        packet.sounds = {
            sound_1: 832304,
            sound_2: 345377,
            sound_3: 730634,
            sound_4: 930495,
            sound_5: 240260,
            sound_6: 567101,
            sound_7: 650249,
            sound_8: 752472,
            sound_9: 679479,
            sound_10: 752002
        }
        player.sendPacket(packet);
    }

}