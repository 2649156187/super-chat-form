# super-chat-form

基于 Vue3 Composition API 的可扩展对话组件实现。

## 目录

- `src/components/ChatConversation.vue`：聊天主组件（左右消息布局、发送逻辑、插件渲染接入）。
- `src/components/chat/renderers/*`：内置消息渲染器（text、msg-card、card-list、card-review）。
- `src/types/chat.ts`：聊天领域数据结构。
- `src/services/chatRepository.ts`：与后端交互的存储与发送逻辑。

## 插件式渲染

`ChatConversation` 支持通过 `rendererMap` 注入新消息类型渲染器。

```vue
<ChatConversation
  :conversation="conversation"
  :repository="repository"
  :renderer-map="{
    'my-custom-type': MyCustomRenderer
  }"
/>
```

## 存储格式建议

- conversation（会话元数据）
- message（按消息分行存储，`content_json` 保存任意类型消息体）

参考 `src/services/chatRepository.ts` 注释中的建模建议。
