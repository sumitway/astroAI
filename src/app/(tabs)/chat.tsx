/**
 * AI Chat Screen — Jyotish AI Assistant
 * Conversational AI trained on Vedic astrology knowledge.
 * Integrates with AWS Bedrock / Claude API via Lambda.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily, FontSize, Spacing } from '@theme/index';
import { CosmicBackground } from '@components/ui/CosmicBackground';
import { GlassCard } from '@components/ui/GlassCard';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const SUGGESTED_QUESTIONS = [
  '🔮 Interpret my birth chart',
  '✦ What does my current dasha mean?',
  '☽ Explain my moon sign personality',
  '♃ Jupiter transit effects for me',
  '🪐 Sade Sati — am I in it?',
  '❓ Best career path from my chart',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Namaste! 🙏 I am Jyotish AI, your personal Vedic astrology guide.

I can help you understand:
• **Birth chart interpretations** (Lagna, houses, planets)
• **Dasha periods** and their life themes
• **Planetary transits** and their effects
• **Yogas and doshas** in your chart
• **Nakshatra analysis** and personality insights
• **Remedies** and gemstone recommendations

Ask me anything about your cosmic blueprint! ✦`,
    timestamp: new Date(),
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // TODO: Replace with actual API call to Lambda/Bedrock
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(text),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, I\'m having trouble connecting right now. Please try again in a moment. 🙏',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, []);

  return (
    <View style={styles.container}>
      <CosmicBackground starCount={40} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>◈</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Jyotish AI</Text>
            <Text style={styles.headerStatus}>✦ Online · Vedic Astrology Expert</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          />

          {/* Suggested questions */}
          {messages.length === 1 && (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>Suggested questions</Text>
              <View style={styles.suggestionsGrid}>
                {SUGGESTED_QUESTIONS.map(q => (
                  <TouchableOpacity
                    key={q}
                    style={styles.suggestionChip}
                    onPress={() => sendMessage(q.replace(/^[^\s]+\s/, ''))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your chart..."
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={500}
              returnKeyType="default"
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Colors.gradients.cosmic}
                style={styles.sendBtnGradient}
              >
                {isTyping
                  ? <ActivityIndicator color={Colors.textPrimary} size="small" />
                  : <Text style={styles.sendIcon}>↑</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.messageBubbleRow, isUser && styles.messageBubbleRowUser]}>
      {!isUser && (
        <View style={styles.aiAvatarSmall}>
          <Text style={styles.aiAvatarSmallText}>✦</Text>
        </View>
      )}
      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleAI,
      ]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.content}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={[styles.messageBubbleRow]}>
      <View style={styles.aiAvatarSmall}>
        <Text style={styles.aiAvatarSmallText}>✦</Text>
      </View>
      <View style={[styles.bubble, styles.bubbleAI, styles.typingBubble]}>
        <View style={styles.typingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
}

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('dasha')) {
    return `Your current Maha Dasha is **Jupiter (Guru)** which spans 16 years and focuses on wisdom, expansion, and spiritual growth. \n\nWithin this, you're in the **Saturn Antar Dasha**, which adds themes of discipline, karma, and long-term planning. This combination often brings:\n\n• Career advancement through hard work\n• Interest in philosophy and higher learning\n• Important karmic relationships\n\nThe Jupiter-Saturn period is particularly powerful for building lasting structures in life. 🪐`;
  }
  if (lower.includes('moon') || lower.includes('lunar')) {
    return `Your **Moon in Capricorn (10th house)** suggests you are emotionally fulfilled through achievement and recognition. You have a practical, disciplined emotional nature.\n\nThe Moon is in **Shravana nakshatra** (pada 3) — symbolized by three footprints, ruled by Vishnu. This gives you:\n\n• Strong listening and learning abilities\n• Connection to tradition and wisdom\n• Potential in communication-related fields\n\nYour emotional security comes from tangible achievements and social status. ☽`;
  }
  return `This is a fascinating question about your chart! Based on your **Cancer Lagna** with **Jupiter in the 1st house**, you have a naturally expansive and optimistic personality.\n\nKey observations:\n• Your **Atmakaraka** (soul significator) suggests deep karmic lessons around relationships\n• The **Yogakaraka** for Cancer ascendant is **Mars** — strengthening action and initiative\n• Your **10th lord** indicates career success through nurturing professions\n\nWould you like me to dive deeper into any specific area? 🔮`;
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.cosmicVoid },
  safeArea:     { flex: 1 },
  flex:         { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  aiAvatar: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDim,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: { fontSize: 22, color: Colors.primary },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  headerStatus: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.success,
    marginTop: 1,
  },
  messageList: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[2],
    gap: Spacing[3],
  },
  messageBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  messageBubbleRowUser: { justifyContent: 'flex-end' },
  aiAvatarSmall: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiAvatarSmallText: { fontSize: 12, color: Colors.primary },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: Spacing[3],
    gap: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.glassSurface,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.textMuted,
    alignSelf: 'flex-end',
  },
  typingBubble: { paddingVertical: Spacing[3] },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dot: {
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  dot1: {}, dot2: { opacity: 0.8 }, dot3: { opacity: 1 },
  suggestions: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[2],
  },
  suggestionsTitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing[2],
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  suggestionChip: {
    backgroundColor: Colors.glassSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    backgroundColor: Colors.glassOverlay,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.glassSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    maxHeight: 120,
  },
  sendBtn: { flexShrink: 0 },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnGradient: {
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
  },
});
