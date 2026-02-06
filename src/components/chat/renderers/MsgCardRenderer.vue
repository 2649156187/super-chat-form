<script setup lang="ts">
import { computed } from 'vue';
import type { ChatCard, ChatMessage } from '../../../types/chat';

const props = defineProps<{ message: ChatMessage }>();

const card = computed(() => {
  const content = props.message.content as { card?: ChatCard };
  return content.card;
});
</script>

<template>
  <article v-if="card" class="msg-card">
    <img v-if="card.image" :src="card.image" :alt="card.title" class="cover" />
    <h4>{{ card.title }}</h4>
    <p>{{ card.summary }}</p>
  </article>
</template>

<style scoped>
.msg-card {
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  padding: 12px;
  max-width: 320px;
  background: #fff;
}
.cover {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>
