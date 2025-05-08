// src/types/conversation.ts
import { User } from './user';

export interface Conversation {
  id: number;
  candidate_id: number;  // Reference to the candidate (user)
  recruiter_id: number;  // Reference to the recruiter (user)
  created_at: string;    // timestamp, format: YYYY-MM-DD HH:mm:ss
  candidate?: User;      // Candidate user data (populated via Sequelize association)
  recruiter?: User;      // Recruiter user data (populated via Sequelize association)
}
