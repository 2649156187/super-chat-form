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
  <aside v-if="card" class="review">
    <img v-if="card.image" :src="card.image" :alt="card.title" class="cover" />
    <div>
      <h3>{{ card.title }}</h3>
      <p>{{ card.summary }}</p>
      <div v-if="card.tags?.length" class="tags">
        <span v-for="tag in card.tags" :key="tag">#{{ tag }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.review {
  max-width: 520px;
  border: 1px solid #82a8ff;
  background: #f5f8ff;
  border-radius: 12px;
  padding: 14px;
}
.cover {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  color: #3b5ccc;
}
</style>
