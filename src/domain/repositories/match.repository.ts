import { Match } from "../entities/match.entity";

export interface MatchRepository {
  findAll(): Promise<Match[]>;
  findByUserId(userId: string): Promise<Match[]>;
}