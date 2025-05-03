import { Match } from "../entities/match.entity";

export interface StatisticsRepository {
  findLastMatch(): Promise<Match | null>;
  findMatchesFromLast24Hours(): Promise<Match[]>;
  getLastMatch(): Promise<Match | null>;
  getMatchesSince(date: Date): Promise<Match[]>;
}

