import { ITask } from "../../managers/task/types"

export class BattleTask {

    public executed: boolean = false

    public constructor(
        public readonly time: number,
        public readonly task: ITask,
    ) { }

    public execute() {
        if (!this.executed) {
            this.executed = true
            this.task()
        }
    }
}