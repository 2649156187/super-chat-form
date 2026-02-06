# super-chat-form

基于 Vue3 Composition API 的可扩展对话组件实现。

## 启动

```bash
npm install
npm run dev
```

## 功能点

- 用户消息靠右、助手消息靠左。
- 插件式渲染：支持通过 `rendererMap` 扩展消息类型。
- 内置类型：`text`、`msg-card`、`card-list`、`card-review`。
- `card-list` 每行最多 3 个卡片，点击后自动插入 `card-review` 预览消息。
- 支持通过 `ChatRepository` 对接后端的历史查询、发送、持久化。

## 目录

- `src/components/ChatConversation.vue`：聊天主组件。
- `src/components/chat/renderers/*`：内置渲染器。
- `src/types/chat.ts`：聊天领域数据结构。
- `src/services/chatRepository.ts`：后端交互仓储接口。
- `src/App.vue`：本地演示页（内存 mock 仓储）。
