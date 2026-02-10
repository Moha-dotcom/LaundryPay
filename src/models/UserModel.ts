


export default class UserModel {
    private _full_name: string;
    private _phoneNumber: string;
    constructor( full_name : string,   phoneNumber : string) {
        this._full_name = full_name;
        this._phoneNumber = phoneNumber;
    }

    get full_name(): string {
        return this._full_name;
    }
    get phoneNumber(): string {
        return this._phoneNumber;
    }

}
//
//
