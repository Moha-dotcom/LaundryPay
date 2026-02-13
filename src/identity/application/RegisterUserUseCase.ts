import UserRepository from '../domain/UserRepository.ts'
import User from "../domain/User";

class RegisterUserUseCase {
    // private userRepository: UserRepository
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async execute (user: User): Promise<void> {

    }
}