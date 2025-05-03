import { User } from '../entities/user.entity';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  getBalance(id: string): Promise<{ btc: number; usd: number } | null>;
}
