import { Logger } from "@/utils/logger";
import { BattleTask } from "../../utils/task";
import { ITask } from "./types";

export class BattleTaskManager {

    private generatedTasks = 0;
    private tasks: Map<number, BattleTask> = new Map()

    public scheduleTask(
        callable: ITask,
        time: number = 1000,
        repeat: boolean = false,
        owner?: string,
    ) {
        const task = new BattleTask(++this.generatedTasks, callable, time, repeat, owner)
        this.tasks.set(task.id, task)
        return task
    }

    public cancelTask(id: number) {
        const task = this.tasks.get(id)
        if (task) {
            task.executed = true
            this.tasks.delete(id)
        }
    }

    public unregisterTask(id: number) {
        this.tasks.delete(id)
    }

    public unregisterOwnerTasks(owner: string) {
        for (const [id, task] of this.tasks) {
            if (task.owner === owner) { this.tasks.delete(id) }
        }
    }

    public unregisterAll() {
        this.tasks.clear()
    }

    public update() {
        const now = Date.now()
        for (const [id, task] of this.tasks) {
            if (task.executeAt <= now) {
                task.execute()

                if (task.repeat) {
                    task.restart()
                    continue;
                }

                this.tasks.delete(id)
            }
        }
    }
}