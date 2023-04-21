import { GptMessage } from "../interfaces";

enum ChatAction {
  send_message = "send_message",
  receive_message = "receive_message",
}

export default function chatConversationReducer(
  state: { currentConversation: Array<GptMessage> },
  action: { type: string; message: string }
) {
  const { type, message } = action;
  switch (type) {
    case ChatAction.send_message:
      return {
        currentConversation: [...state.currentConversation, { role: "user", content: message }],
      };
    case ChatAction.receive_message:
      return {
        currentConversation: [...state.currentConversation, { role: "user", content: message }],
      };
    default:
      return state;
  }
}
