import { UserRepository } from '../../domain/repositories/user.repository';

export class GetUserBalance {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<{ btc: number; usd: number } | null> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const balance = await this.userRepository.getBalance(userId);
    
    if (!balance) {
      throw new Error('User not found');
    }

    return balance;
  }
}
