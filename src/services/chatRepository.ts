import type {
  ChatConversation,
  ChatMessage,
  ChatPersistPayload,
  SendMessageRequest,
  SendMessageResponse,
} from '../types/chat';

export interface ChatRepository {
  createConversation(payload: Pick<ChatConversation, 'userId' | 'title' | 'context'>): Promise<ChatConversation>;
  listMessages(conversationId: string): Promise<ChatMessage[]>;
  sendMessage(payload: SendMessageRequest): Promise<SendMessageResponse>;
  persistConversation(payload: ChatPersistPayload): Promise<void>;
}

/**
 * 数据库存储建议（关系型/文档型都可）
 *
 * conversation
 * - id: string (PK)
 * - user_id: string (index)
 * - title: string
 * - context_json: json
 * - created_at / updated_at
 *
 * message
 * - id: string (PK)
 * - conversation_id: string (index)
 * - role: enum(user, assistant, system)
 * - type: string
 * - content_json: json
 * - created_at: datetime (index)
 * - status: enum(sending, sent, failed)
 *
 * 关键操作逻辑
 * 1) 用户发送消息：先写入 user message(status=sent)；
 * 2) 调用生成接口；
 * 3) 将返回分片/多消息统一落库（assistant messages）；
 * 4) 更新 conversation.updated_at；
 * 5) 前端按 created_at 顺序重放即可恢复完整聊天记录。
 */
export class HttpChatRepository implements ChatRepository {
  constructor(private readonly baseUrl: string) {}

  async createConversation(
    payload: Pick<ChatConversation, 'userId' | 'title' | 'context'>,
  ): Promise<ChatConversation> {
    return this.request<ChatConversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async listMessages(conversationId: string): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/conversations/${conversationId}/messages`, {
      method: 'GET',
    });
  }

  async sendMessage(payload: SendMessageRequest): Promise<SendMessageResponse> {
    return this.request<SendMessageResponse>('/chat/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async persistConversation(payload: ChatPersistPayload): Promise<void> {
    await this.request<void>('/conversations/persist', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Chat API request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}
