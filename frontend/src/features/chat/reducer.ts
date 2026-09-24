import { Message } from '@/types/chat';

export interface ConversationState {
  messages: Message[];
  status: 'idle' | 'loading' | 'error';
  conversationId: string | null;
  title: string;
  isTyping: boolean;
  error?: string;
}

export type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'RECEIVE_MESSAGE'; payload: Message }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'CLEAR_CONVERSATION' }
  | { type: 'LOAD_CONVERSATION'; payload: { messages: Message[], conversationId: string, title: string } };

export const initialChatState: ConversationState = {
  messages: [],
  status: 'idle',
  conversationId: null,
  title: 'New Chat',
  isTyping: false
};

export function chatReducer(state: ConversationState, action: ChatAction): ConversationState {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload], status: 'loading', isTyping: true, error: undefined };
    case 'RECEIVE_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload], status: 'idle', isTyping: false };
    case 'SET_ERROR':
      return { ...state, status: 'error', error: action.payload, isTyping: false };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    case 'CLEAR_CONVERSATION':
      return initialChatState;
    case 'LOAD_CONVERSATION':
      return { ...state, messages: action.payload.messages, conversationId: action.payload.conversationId, title: action.payload.title, status: 'idle', error: undefined };
    default:
      return state;
  }
}
