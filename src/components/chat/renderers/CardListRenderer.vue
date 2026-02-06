<script setup lang="ts">
import { computed } from 'vue';
import type { ChatCard, ChatMessage } from '../../../types/chat';

const emit = defineEmits<{
  cardClick: [card: ChatCard, sourceMessageId: string];
}>();

const props = defineProps<{ message: ChatMessage }>();

const payload = computed(() => props.message.content as { title?: string; cards?: ChatCard[]; columns?: number });
const cards = computed(() => payload.value.cards ?? []);
const columns = computed(() => Math.max(1, Math.min(3, payload.value.columns ?? 3)));

const onCardClick = (card: ChatCard) => {
  emit('cardClick', card, props.message.id);
};
</script>

<template>
  <section>
    <h4 v-if="payload.title" class="heading">{{ payload.title }}</h4>
    <div class="grid" :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
      <article
        v-for="card in cards"
        :key="card.id"
        class="item"
        role="button"
        tabindex="0"
        @click="onCardClick(card)"
      >
        <img v-if="card.image" :src="card.image" :alt="card.title" class="cover" />
        <h5>{{ card.title }}</h5>
        <p>{{ card.summary }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.heading {
  margin: 0 0 8px;
}
.grid {
  display: grid;
  gap: 12px;
}
.item {
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  background: #fff;
}
.cover {
  width: 100%;
  border-radius: 6px;
  margin-bottom: 8px;
}
</style>
