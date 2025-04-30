// src/types/message.ts
import { Conversation } from './conversation';
import { User } from './user';

export interface Message {
  id: number;
  conversation_id: number;   // Foreign key referencing conversation
  sender_id: number;         // Foreign key referencing sender (user)
  receiver_id: number;       // Foreign key referencing receiver (user)
  content: string;           // Message content
  created_at: string;        // Timestamp of when the message was sent (format: YYYY-MM-DD HH:mm:ss)
  is_read: boolean;          // Whether the message has been read
  conversation?: Conversation; // Populated via association
  sender?: User;             // Populated via association
  receiver?: User;           // Populated via association
}
