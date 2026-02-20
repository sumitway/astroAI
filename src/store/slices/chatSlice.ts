import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Namaste! 🙏 I am Jyotish AI. How can I help you understand your cosmic blueprint today?',
  timestamp: new Date().toISOString(),
};

const initialState: ChatState = {
  messages: [WELCOME],
  isLoading: false,
  sessionId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    clearChat(state) {
      state.messages = [WELCOME];
      state.sessionId = null;
    },
  },
});

export const { addMessage, setLoading, setSessionId, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
