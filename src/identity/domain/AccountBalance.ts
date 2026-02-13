import User from "./User";


export class AccountBalance {
    private readonly  _amount : number
    constructor(amount: number) {
        if(amount < 0) throw new Error("Amount must be greater than $0");
        this._amount = amount;
    }
    deposit(amount: number): AccountBalance {
        if (amount <= 0) throw new Error("Deposit must be positive");
        return new AccountBalance(this._amount + amount);
    }
    // Create a new AccountBalance after spending
    spend(amount: number): AccountBalance {
        if (amount <= 0) throw new Error("Spend amount must be positive");
        if (this._amount < amount) throw new Error("Insufficient balance");
        return new AccountBalance(this._amount - amount);
    }

    // Check if enough balance
    canSpend(amount: number): boolean {
        return this._amount >= amount;
    }
}


