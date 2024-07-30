import { ITask } from "../../managers/task/types"

export class BattleTask {

    public executed: boolean = false

    public constructor(
        public readonly callable: ITask,
        public readonly time: number,
        public owner?: string
    ) { }

    public execute() {
        if (!this.executed) {
            this.executed = true
            this.callable()
        }
    }
}