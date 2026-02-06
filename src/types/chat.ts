export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessageType =
  | 'text'
  | 'msg-card'
  | 'card-list'
  | 'card-review'
  | (string & {});

export interface ChatCard {
  id: string;
  title: string;
  summary?: string;
  image?: string;
  tags?: string[];
  meta?: Record<string, unknown>;
}

export interface ChatContentText {
  text: string;
}

export interface ChatContentMsgCard {
  card: ChatCard;
}

export interface ChatContentCardList {
  title?: string;
  cards: ChatCard[];
  columns?: number;
}

export interface ChatContentCardReview {
  card: ChatCard;
  sourceMessageId?: string;
}

export type ChatMessageContent =
  | ChatContentText
  | ChatContentMsgCard
  | ChatContentCardList
  | ChatContentCardReview
  | Record<string, unknown>;

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  type: ChatMessageType;
  content: ChatMessageContent;
  createdAt: string;
  status?: 'sending' | 'sent' | 'failed';
}

export interface ChatConversation {
  id: string;
  userId: string;
  title?: string;
  context?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatPersistPayload {
  conversation: ChatConversation;
  messages: ChatMessage[];
}

export interface ChatRendererProps {
  message: ChatMessage;
}

export interface SendMessageRequest {
  conversationId: string;
  userInput: string;
  context?: Record<string, unknown>;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessages: ChatMessage[];
}
