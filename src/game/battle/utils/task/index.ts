import { Logger } from "@/utils/logger";
import { ITask } from "../../managers/task/types"

export class BattleTask {

    public executed: boolean = false
    public executeAt: number = -1;

    public constructor(
        public readonly id: number,
        public readonly callable: ITask,
        public readonly time: number = 1000,
        public readonly repeat: boolean = false,
        public readonly owner?: string
    ) {
        this.restart();
    }

    public restart() {
        this.executed = false;
        this.executeAt = Date.now() + this.time
    }

    public execute() {
        if (!this.executed) {
            this.executed = true
            this.callable()
        }
    }
}