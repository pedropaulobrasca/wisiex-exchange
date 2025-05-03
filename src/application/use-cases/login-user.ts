import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export interface LoginUserResult {
  token: string;
}

export class LoginUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string): Promise<LoginUserResult> {
    if (!username || username.trim() === '') {
      throw new Error('Nome de usuário é obrigatório');
    }

    let user = await this.userRepository.findByUsername(username);

    if (!user) {
      user = await this.userRepository.create(
        new User({
          username,
          usdBalance: 100_000,
          btcBalance: 100,
        })
      );
    }

    if (!user.id) {
      throw new Error('Erro ao criar/encontrar usuário');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { token };
  }
} 