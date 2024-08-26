import { Player } from "@/game/player";
import { CommandSender } from "../../types";
import { Command } from "../../utils/command";
import { Logger } from "@/utils/logger";
import { Vector3d } from "@/utils/vector-3d";
import { RayHit } from "@/game/map/managers/collision/utils/rayhit";

export class DevCommand extends Command {

    public constructor() {
        super("dev", "Features de desenvolvedor");
    }

    public execute(sender: CommandSender, args: string[]): void {
        if (sender instanceof Player) {
            if (args.length < 1) {
                sender.sendMessage("Uso correto: /dev (sub-command) (args...)");
                return;
            }

            switch (args.shift().toLowerCase()) {
                case 'health': {

                    if (args.length < 1) {
                        sender.sendMessage("Uso correto: /dev health (quantidade)");
                        return;
                    }

                    const battle = sender.tank.battle;
                    if (!battle) {
                        sender.sendMessage("Você não está em batalha");
                        return;
                    }

                    sender.tank.setHealth(parseInt(args.shift()));
                    sender.sendMessage(`Você setou sua vida para ${sender.tank.getHealth()}`);
                    break
                }

                case 'position:': {
                    sender.sendMessage(sender.tank.getPosition().toString())
                    break
                }
                case 'collision': {
                    const battle = sender.battle;
                    if (!battle) {
                        sender.sendMessage("Você não está em batalha");
                        return;
                    }

                    battle.minesManager.placeMine(sender)

                    Logger.debug()
                    Logger.debug(sender.tank.getPosition().toString())

                    const ray = new RayHit()
                    // battleService.§'x§().§const const true§().raycastStatic(param3,Vector3.DOWN,§super const continue§.§finally catch while§,10000000000,null,_loc10_)
                    const collisions = battle.map.collisionManager.raycastStatic(
                        sender.tank.getPosition().swap(),
                        Vector3d.DOWN,
                        16,
                        10000000000,
                        null,
                        ray
                    );


                    Logger.debug(ray.position.swap().toString())
                    Logger.debug()

                    if (collisions) {
                        battle.minesManager.placeMine(sender, ray.position.swap())
                        sender.sendMessage("Colisão encontrada " + ray.position.swap().toString())
                        return
                    }

                    sender.sendMessage("Nenhuma colisão encontrada")

                    // if (collisions.length === 0) {
                    //     battle.minesManager.placeMine(sender);
                    // }

                    // Logger.debug(sender.tank.getPosition().toString(), collisions)
                    break;
                }
                case 'teleport': {
                    if (args.length < 3) {
                        sender.sendMessage("Uso correto: /dev teleport (x) (y) (z)");
                        return;
                    }

                    sender.tank.setPosition(new Vector3d(
                        parseFloat(args.shift()),
                        parseFloat(args.shift()),
                        parseFloat(args.shift())
                    ));
                    break;
                }

                case 'temperature': {

                    if (args.length < 3) {
                        sender.sendMessage("Uso correto: /dev temperature (quantidade) (max) (damage)");
                        return;
                    }

                    const [heat, max, damage] = args.map(parseFloat);

                    sender.tank.heat(heat, max, damage, sender);
                    break;
                }

                case 'jail': {
                    const battle = sender.battle;
                    if (!battle) {
                        sender.sendMessage("Você não está em batalha");
                        return;
                    }

                    // if (args.length < 1) {
                    //     sender.sendMessage("Uso correto: /dev jail (radius)");
                    //     return;
                    // }

                    // const radius = parseFloat(args.shift());
                    let radius = 10
                    let pi = 0

                    while (true) {

                        if (pi >= 2 * Math.PI) {
                            pi = 0;
                            radius += 1;
                        }

                        if (radius >= 20) {
                            break;
                        }

                        battle.minesManager.placeMine(sender,
                            sender.tank.getPosition().add(
                                new Vector3d(
                                    Math.cos(pi) * radius,
                                    0,
                                    Math.sin(pi) * radius
                                )
                            )
                        );

                        pi += Math.PI / 32;
                    }
                    // for (let pi = 0; pi < 2 * Math.PI; pi += Math.PI / 32) {

                    // }
                }

            }
        }
    }

}
