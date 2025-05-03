import { Match } from '../../domain/entities/match.entity';
import { MatchRepository } from '../../domain/repositories/match.repository';

export class GetAllMatches {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(): Promise<Match[]> {
    return this.matchRepository.findAll();
  }
} 