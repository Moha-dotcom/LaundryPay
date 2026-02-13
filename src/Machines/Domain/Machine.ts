
const log = console.log;
enum Status {
    Idle =   'IDLE',
    Washing =  'WASHING',
    Drying =  'DYING',
    Finished =  'FINISHED',
}



class Machine {
    private machineId: number;
    private status: Status;
    private currentUserId : number;
    constructor(machineId : number, status : Status , currentUserId : number ) {
        this.status = status;
        this.currentUserId = currentUserId;
        this.machineId = machineId;
    }

    isAvailable(machine : Machine) : boolean {
        return machine.status === Status.Idle;
    }

    start(machine : Machine) : {}  {
        if(!this.isAvailable(machine )) {
           let message  =  new Error ('Machine not available').message;
            return {errorMsg : message, status : machine.status, readyToUse : false };
        }
        else return {readyToUse : true};
    }
    stop(machine : Machine) {
        return machine.status === Status.Finished;
    }
}

console.log(Status.Washing)

const machineK = new Machine(92, Status.Idle, 9233);
// console.log(machineK.isAvailable(machineK));
log(machineK.start(machineK));
// log(machineK.stop(machineK));