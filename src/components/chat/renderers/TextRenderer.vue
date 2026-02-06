<script setup lang="ts">
import { computed } from 'vue';
import type { ChatMessage } from '../../../types/chat';

const props = defineProps<{ message: ChatMessage }>();
const text = computed(() => {
  const content = props.message.content as { text?: string };
  return content.text ?? '';
});
</script>

<template>
  <p class="text-content">{{ text }}</p>
</template>

<style scoped>
.text-content {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
