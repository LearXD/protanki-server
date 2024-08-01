import { Player } from "@/game/player";
import { SetBattleUserStatusPacket } from "@/network/packets/set-battle-user-status";
import { SetLoadDeathMatchPacket } from "@/network/packets/set-load-death-match";
import { SetBattleAddUsersPropertiesPacket } from "@/network/packets/set-battle-add-users-properties";
import { BattleModeManager } from "../..";
import { SetBattleUsersPropertiesPacket } from "@/network/packets/set-battle-users-properties";
import { SetBattleUserLeftNotificationPacket } from "@/network/packets/set-battle-user-left-notification";
import { IMapSpawn } from "@/game/map/types";
import { BattleMode } from "@/states/battle-mode";
import { MathUtils } from "@/utils/math";

export class BattleDeathMatchModeManager extends BattleModeManager {

    public getSpawns(): IMapSpawn[] {
        return this.battle.getMap().getSpawns()
            .filter(spawn => spawn.type?.toUpperCase() === BattleMode.DM)
    }

    public getRandomSpawn(player: Player): IMapSpawn {
        const spawns = this.getSpawns()

        if (spawns.length === 0) {
            return null
        }

        const random = MathUtils.randomInt(0, spawns.length - 1)
        return spawns[random]
    }

    public sendLoadBattleMode(player: Player): void {
        player.sendPacket(new SetLoadDeathMatchPacket())
    }

    public broadcastAddUserProperties(player: Player): void {
        const packet = new SetBattleAddUsersPropertiesPacket();
        packet.userId = player.getUsername();
        packet.users = this.battle.getPlayersManager().getPlayers()
            .map(player => {
                return {
                    chatModeratorLevel: player.getData().getModeratorLevel(),
                    deaths: player.getTank().getDeaths(),
                    kills: player.getTank().getKills(),
                    rank: player.getData().getRank(),
                    score: player.getTank().getScore(),
                    name: player.getUsername()
                }
            })

        this.battle.broadcastPacket(packet, [player.getUsername()]);
    }

    public broadcastRemovePlayer(player: Player): void {
        const packet = new SetBattleUserLeftNotificationPacket();
        packet.userId = player.getUsername();
        this.battle.broadcastPacket(packet);
    }

    public broadcastUserStats(player: Player): void {

        const setBattleUserStatusPacket = new SetBattleUserStatusPacket()
        setBattleUserStatusPacket.deaths = player.getTank().getDeaths()
        setBattleUserStatusPacket.kills = player.getTank().getKills()
        setBattleUserStatusPacket.score = player.getTank().getScore()
        setBattleUserStatusPacket.user = player.getUsername()

        this.battle.broadcastPacket(setBattleUserStatusPacket)
    }

    public sendUsersProperties(player: Player): void {

        const packet = new SetBattleUsersPropertiesPacket();
        packet.users = this.battle.getPlayersManager().getPlayers()
            .map((playing) => ({
                chatModeratorLevel: playing.getData().getModeratorLevel(),
                deaths: player.getTank().getDeaths(),
                kills: player.getTank().getKills(),
                rank: playing.getData().getRank(),
                score: player.getTank().getScore(),
                name: playing.getUsername()
            }))

        player.sendPacket(packet);
    }

}