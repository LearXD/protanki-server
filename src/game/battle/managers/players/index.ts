import { Battle } from "../..";
import { SetUserTankResourcesDataPacket } from "../../../../network/packets/set-user-tank-resources-data";
import { ByteArray } from "../../../../utils/network/byte-array";
import { Client } from "../../../client";

export class BattlePlayersManager {

    private players: Map<string, Client> = new Map();

    public constructor(
        private readonly battle: Battle
    ) { }

    public getMaxPlayers() { return this.battle.getData().maxPeopleCount }

    public getPlayers() { return Array.from(this.players.values()) }
    public clearClients() { this.players.clear() }

    public hasPlayer(username: string) { return this.players.has(username) }
    public getPlayer(username: string) { return this.players.get(username) }

    public addPlayer(client: Client) {
        if (!this.hasPlayer(client.getUsername())) {
            this.players.set(client.getUsername(), client);
            return true;
        }
        return false;
    }

    public removePlayer(username: string) {
        if (this.hasPlayer(username)) {
            this.players.delete(username);
            return true;
        }
        return false;
    }

    public sendPlayerData(client: Client) {
        const setUserTankResourcesDataPacket = new SetUserTankResourcesDataPacket(new ByteArray());
        setUserTankResourcesDataPacket.data = {
            battleId: this.battle.getBattleId(),
            colormap_id: 790154,
            hull_id: 'hunter_m1',
            turret_id: 'shotgun_m1',
            team_type: 'NONE',
            partsObject: '{"engineIdleSound":386284,"engineStartMovingSound":226985,"engineMovingSound":75329,"turretSound":242699}',
            hullResource: 377977,
            turretResource: 412746,
            sfxData: '{"magazineReloadSound":223995,"reloadSound":223996,"shotSound":223997,"explosionMarkTexture0":756745,"explosionMarkTexture1":756746,"explosionMarkTexture2":756747,"explosionMarkTexture3":756748,"smokeTexture":756749,"sparkleTexture":756750,"pelletTrailTexture":756751,"shotAlongTexture":423332,"shotAcrossTexture":234233,"lighting":[{"name":"shot","light":[{"attenuationBegin":50,"attenuationEnd":700,"color":16431616,"intensity":1,"time":0},{"attenuationBegin":1,"attenuationEnd":2,"color":16431616,"intensity":0,"time":300}]}],"bcsh":[]}',
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0 },
            incarnation: 0,
            tank_id: client.getUsername(),
            nickname: client.getUsername(),
            state: 'suicide',
            maxSpeed: 8.6,
            maxTurnSpeed: 1.6632988304138179,
            acceleration: 10.97,
            reverseAcceleration: 13.65,
            sideAcceleration: 11.62,
            turnAcceleration: 2.4125685504632512,
            reverseTurnAcceleration: 4.031885009158302,
            mass: 2280,
            power: 10.97 * 1000000,
            dampingCoeff: 1500,
            turret_turn_speed: 1.8149678891489032,
            health: 0,
            rank: 10,
            kickback: 2.3149,
            turretTurnAcceleration: 2.6148522853379044,
            impact_force: 0.2932 * 100,
            state_null: false
        }
        client.sendPacket(setUserTankResourcesDataPacket)
    }
}