import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export class GetUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }
} 