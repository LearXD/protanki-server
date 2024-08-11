import { BattleTask } from "../../utils/task";
import { ITask } from "./types";

export class BattleTaskManager {

    private generatedTasks = 0;
    private tasks: Map<number, BattleTask> = new Map();

    public scheduleTask(
        callable: ITask,
        time: number = 1000,
        owner?: string
    ) {
        const taskId = ++this.generatedTasks;
        const formattedTime = Date.now() + time;
        this.tasks.set(taskId, new BattleTask(callable, formattedTime, owner))
        return taskId
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
            if (task.time < now) {
                task.execute()
                this.tasks.delete(id)
            }
        }
    }
}