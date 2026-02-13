
const log = console.log;
enum Status {
    Idle =   'IDLE',
    Washing =  'WASHING',
    Drying =  'DYING',
    Finished =  'FINISHED',
}



class Machine {

    private readonly _machineId: number;
    private _status: Status;
    private _currentUserId: number | null;
    constructor(machineId : number ) {
        this._status = Status.Idle;
        this._currentUserId = null
        this._machineId = machineId;
    }
    get status(): Status {
        return this._status;
    }

    get currentUserId(): number | null {
        return this._currentUserId;
    }


    get machineId(): number {
        return this._machineId;
    }




    isAvailable(): boolean {
        return this.status === Status.Idle;
    }

    start(userId : number)   {
            if (!this.isAvailable()) {
                throw new Error("Machine not available");
            }

            this._currentUserId = userId;
            this._status = Status.Washing;
    }
    finish() {
        if(this.status !== Status.Washing && this.status !== Status.Drying) {
            throw new Error("Machine is not running");
        }
        this._status = Status.Finished;

    }
    reset() {
        if (this.status !== Status.Finished) {
            throw new Error("Cannot reset machine before finishing");
        }


        this._currentUserId = null;
        this._status = Status.Idle;
    }
}

