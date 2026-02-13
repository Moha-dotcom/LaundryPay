import User from "./User";

export default interface UserRepository {
      // findUserByEmail(email: string): Promise<User>;
       findUserByPhoneNumber(email: string): Promise<boolean>;
      saveUser(user : User): Promise<boolean>;
      // findUserById(id: string): Promise<User>;
}