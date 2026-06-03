import { User } from "../entities/entities";


export abstract class AuthRepository {
    abstract login(email: string, password: string): Promise<User>;
    abstract register(email: string, password: string, fullName: string): Promise<User>;
    abstract logout(): Promise<void>;
}