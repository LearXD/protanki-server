import { Server } from "@/server";
import { BattleTask } from "../../utils/task";
import { ITask, TimeType } from "./types";

export class BattleTaskManager {

    private tasks: BattleTask[] = []

    public registerTask(task: ITask, time: number, timeType: TimeType = TimeType.MILLISECONDS) {
        this.tasks.push(new BattleTask(Date.now() + (time * timeType), task))
    }

    public unregisterAll() {
        this.tasks = []
    }

    public update() {
        const now = Date.now()
        for (const task of this.tasks) {
            if (task.time < now) {
                task.execute()
            }
        }
    }
}