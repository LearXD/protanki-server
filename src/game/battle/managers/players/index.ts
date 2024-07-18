import { Battle } from "../..";
import { SetUserTankResourcesDataPacket } from "../../../../network/packets/set-user-tank-resources-data";
import { Player } from "../../../player";

export class BattlePlayersManager {

    private players: Map<string, Player> = new Map();

    public constructor(
        private readonly battle: Battle
    ) { }

    public getMaxPlayers() { return this.battle.getData().maxPeopleCount }

    public getPlayers() { return Array.from(this.players.values()) }
    public clearClients() { this.players.clear() }

    public hasPlayer(username: string) {
        return this.players.has(username)
    }

    public getPlayer(username: string) {
        return this.players.get(username)
    }

    public addPlayer(player: Player) {
        this.players.set(player.getUsername(), player)
        this.battle.getStatisticsManager().addPlayer(player.getUsername())
        player.setBattle(this.battle)
    }

    public removePlayer(username: string) {
        const player = this.players.get(username)
        if (player) {
            this.players.delete(username);
            this.battle.getStatisticsManager().removePlayer(username);
            player.setBattle(null)
        }
    }

    public sendPlayerData(client: Player) {
        const turret = client.getGarageManager().getEquippedTurret();
        const turretItem = client.getServer().getGarageManager().getItem(turret);
        const turretProperties = client.getServer().getGarageManager().getTurretProperties(turret);
        const turretSfx = client.getServer().getGarageManager().getTurretSfx(turret);

        const hull = client.getGarageManager().getEquippedHull();
        const hullItem = client.getServer().getGarageManager().getItem(hull);
        const hullProperties = client.getServer().getGarageManager().getHullProperties(hull);

        const painting = client.getGarageManager().getEquippedPainting();
        const paintingItem = client.getServer().getGarageManager().getItem(painting);

        const setUserTankResourcesDataPacket = new SetUserTankResourcesDataPacket();
        setUserTankResourcesDataPacket.data = {
            battleId: this.battle.getBattleId(),
            colormap_id: paintingItem.coloring,
            hull_id: hull,
            turret_id: turret,
            team_type: 'NONE',
            partsObject: '{"engineIdleSound":386284,"engineStartMovingSound":226985,"engineMovingSound":75329,"turretSound":242699}',
            hullResource: hullItem.object3ds,
            turretResource: turretItem.object3ds,
            sfxData: JSON.stringify(turretSfx),
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0 },
            incarnation: 0,
            tank_id: client.getUsername(),
            nickname: client.getUsername(),
            state: 'suicide',
            maxSpeed: hullProperties.maxSpeed,
            maxTurnSpeed: hullProperties.maxTurnSpeed,
            acceleration: hullProperties.acceleration,
            reverseAcceleration: hullProperties.reverseAcceleration,
            sideAcceleration: hullProperties.sideAcceleration,
            turnAcceleration: hullProperties.turnAcceleration,
            reverseTurnAcceleration: hullProperties.reverseTurnAcceleration,
            mass: hullProperties.mass,
            power: hullProperties.power,
            dampingCoeff: hullProperties.dampingCoeff,
            turret_turn_speed: turretProperties.turretTurnAcceleration,
            health: 0,
            rank: client.getData().getRank(),
            kickback: turretProperties.kickback,
            turretTurnAcceleration: turretProperties.turretTurnAcceleration,
            impact_force: turretProperties.impact_force,
            state_null: false
        }
        client.sendPacket(setUserTankResourcesDataPacket)
    }
}