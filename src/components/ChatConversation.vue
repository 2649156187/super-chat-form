<script setup lang="ts">
import { computed, onMounted, ref, type Component } from 'vue';
import type { ChatCard, ChatConversation, ChatMessage } from '../types/chat';
import type { ChatRepository } from '../services/chatRepository';
import TextRenderer from './chat/renderers/TextRenderer.vue';
import MsgCardRenderer from './chat/renderers/MsgCardRenderer.vue';
import CardListRenderer from './chat/renderers/CardListRenderer.vue';
import CardReviewRenderer from './chat/renderers/CardReviewRenderer.vue';

const props = defineProps<{
  conversation: ChatConversation;
  repository: ChatRepository;
  rendererMap?: Record<string, Component>;
}>();

const messages = ref<ChatMessage[]>([]);
const input = ref('');
const loading = ref(false);

const builtinRendererMap: Record<string, Component> = {
  text: TextRenderer,
  'msg-card': MsgCardRenderer,
  'card-list': CardListRenderer,
  'card-review': CardReviewRenderer,
};

const mergedRendererMap = computed(() => ({
  ...builtinRendererMap,
  ...(props.rendererMap ?? {}),
}));

const resolveRenderer = (messageType: string) => mergedRendererMap.value[messageType] ?? TextRenderer;

const appendReviewMessage = async (card: ChatCard, sourceMessageId: string) => {
  const reviewMessage: ChatMessage = {
    id: crypto.randomUUID(),
    conversationId: props.conversation.id,
    role: 'assistant',
    type: 'card-review',
    content: {
      card,
      sourceMessageId,
    },
    createdAt: new Date().toISOString(),
    status: 'sent',
  };

  messages.value.push(reviewMessage);
  await props.repository.persistConversation({
    conversation: props.conversation,
    messages: messages.value,
  });
};

const loadHistory = async () => {
  messages.value = await props.repository.listMessages(props.conversation.id);
};

const send = async () => {
  if (!input.value.trim() || loading.value) return;

  loading.value = true;
  try {
    const response = await props.repository.sendMessage({
      conversationId: props.conversation.id,
      userInput: input.value,
    });

    messages.value.push(response.userMessage, ...response.assistantMessages);
    input.value = '';

    await props.repository.persistConversation({
      conversation: props.conversation,
      messages: messages.value,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void loadHistory();
});
</script>

<template>
  <section class="chat-wrapper">
    <div class="chat-list">
      <article
        v-for="message in messages"
        :key="message.id"
        class="bubble"
        :class="message.role === 'user' ? 'bubble--right' : 'bubble--left'"
      >
        <component :is="resolveRenderer(message.type)" :message="message" @card-click="appendReviewMessage" />
      </article>
    </div>

    <footer class="chat-input">
      <textarea v-model="input" rows="3" placeholder="请输入内容..." />
      <button :disabled="loading" @click="send">发送</button>
    </footer>
  </section>
</template>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
.chat-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bubble {
  max-width: 75%;
  border-radius: 12px;
  padding: 10px;
}
.bubble--left {
  align-self: flex-start;
  background: #f3f4f6;
}
.bubble--right {
  align-self: flex-end;
  background: #dbeafe;
}
.chat-input {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}
textarea {
  resize: none;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 8px;
}
button {
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  padding: 0 16px;
}
</style>
