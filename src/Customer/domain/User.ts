import {AccountBalance} from './AccountBalance';

export default class User {
    private readonly _full_name: string;
    private readonly _phoneNumber: string;
    private _balance: AccountBalance;
    private _activeMachineId: number | null;

    constructor(full_name: string, phoneNumber: string, initialBalance: number = 0) {
        this._full_name = full_name;
        this._phoneNumber = phoneNumber;
        this._balance = new AccountBalance(initialBalance);
        this._activeMachineId = null;
    }

    get full_name(): string {
        return this._full_name;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    get balance(): number {
        return this._balance;
    }

    get activeMachineId(): number | null {
        return this._activeMachineId;
    }


    deposit(amount: number) {
        this._balance = this._balance.deposit(amount);
    }


    canUseMachine(cost: number): boolean {
        return this._balance.canSpend(cost);
    }

    startMachine(machineId: number, cost: number) {
        if (!this.canUseMachine(cost)) throw new Error("Insufficient balance to start machine");
        if (this._activeMachineId) throw new Error("User is already using a machine");

        this._balance.spend(cost)
        this._activeMachineId = machineId;
    }


    stopMachine(machineId: number) {
        if (this._activeMachineId !== machineId) {
            throw new Error("This machine is not currently active for this user");
        }
        this._activeMachineId = null;
    }
}

