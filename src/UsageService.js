// 2.	Pay for usage → deduct from account when machine is used
// 3.	Validate usage → cannot be negative, cannot exceed available balance
// 4.	Record usage → create an entry in the USAGE table


import userService from './UserService.ts';
import accountService from './services/AccountService.js';

class UsageService {
    constructor (accountService, userService ) {
        this.accountService = accountService; // so we dont need to instantiate here
        this.userService = userService;
    }

    payForLaundry(){
    //Fetch the user’s account using accountService.
    // Check the balance to see if they have enough money.
	// Deduct the payment and update the account.
	// Record the transaction if needed.
    // Return confirmation or an error message.

    }

    cancelUsage(){
    // Fetch the scheduled usage for the user.
	// Cancel it in your database or system.
	// Refund or adjust the balance if needed.
    // Return confirmation.
    }
    getUserUsage() {

    }

    applyDiscount() {

    }
}