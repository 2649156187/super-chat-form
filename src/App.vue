<script setup lang="ts">
import ChatConversation from './components/ChatConversation.vue';
import type {
  ChatConversation as Conversation,
  ChatMessage,
  ChatPersistPayload,
  SendMessageRequest,
  SendMessageResponse,
} from './types/chat';
import type { ChatRepository } from './services/chatRepository';

const now = () => new Date().toISOString();

const conversation: Conversation = {
  id: 'demo-conversation',
  userId: 'demo-user',
  title: '演示会话',
  createdAt: now(),
  updatedAt: now(),
};

const db = new Map<string, ChatMessage[]>();

const demoRepository: ChatRepository = {
  async createConversation() {
    return conversation;
  },
  async listMessages(conversationId: string) {
    return db.get(conversationId) ?? [
      {
        id: 'welcome-1',
        conversationId,
        role: 'assistant',
        type: 'text',
        content: { text: '你好！请输入你想生成的内容。' },
        createdAt: now(),
        status: 'sent',
      },
    ];
  },
  async sendMessage(payload: SendMessageRequest): Promise<SendMessageResponse> {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: payload.conversationId,
      role: 'user',
      type: 'text',
      content: { text: payload.userInput },
      createdAt: now(),
      status: 'sent',
    };

    const cards = [1, 2, 3, 4].map((i) => ({
      id: `card-${i}`,
      title: `推荐卡片 ${i}`,
      summary: `这是第 ${i} 张卡片，点击后可预览。`,
      image: `https://picsum.photos/seed/${i}/360/180`,
      tags: ['demo', 'card'],
    }));

    const assistantMessages: ChatMessage[] = [
      {
        id: crypto.randomUUID(),
        conversationId: payload.conversationId,
        role: 'assistant',
        type: 'card-list',
        content: {
          title: '为你生成以下卡片：',
          cards,
          columns: 3,
        },
        createdAt: now(),
        status: 'sent',
      },
    ];

    return { userMessage, assistantMessages };
  },
  async persistConversation(payload: ChatPersistPayload) {
    db.set(payload.conversation.id, [...payload.messages]);
  },
};
</script>

<template>
  <main class="page">
    <h1>Super Chat Form Demo</h1>
    <div class="chat-shell">
      <ChatConversation :conversation="conversation" :repository="demoRepository" />
    </div>
  </main>
</template>

<style scoped>
.page {
  padding: 24px;
  max-width: 1080px;
  margin: 0 auto;
  font-family: Inter, system-ui, Arial, sans-serif;
}
.chat-shell {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 12px;
  height: 80vh;
}
</style>
