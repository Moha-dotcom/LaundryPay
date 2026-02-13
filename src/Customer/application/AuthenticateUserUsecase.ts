// Each file handles:
// Input validation
// Calling domain logic
// Coordinating repositories
// Returning result
import UserRepository from '../domain/UserRepository.ts'
import User from "../domain/User";

class AuthenticateUserUsecase {
    // private userRepository: UserRepository
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async execute (user: User): Promise<void> {
        //
    }
}