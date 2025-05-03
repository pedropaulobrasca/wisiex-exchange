import { Match } from '../../domain/entities/match.entity';
import { MatchRepository } from '../../domain/repositories/match.repository';

export class GetUserMatches {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(userId: string): Promise<Match[]> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    
    return this.matchRepository.findByUserId(userId);
  }
} 