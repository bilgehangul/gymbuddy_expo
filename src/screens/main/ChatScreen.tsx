import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GiftedChat, IMessage, User as GiftedChatUser } from 'react-native-gifted-chat';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { messageApi } from '../../services/api';
import { Message } from '../../types';
import { MainStackParamList } from '../../navigation/AppNavigator';

type ChatScreenRouteProp = RouteProp<MainStackParamList, 'ChatScreen'>;

interface Props {
  route: ChatScreenRouteProp;
}

const ChatScreen: React.FC<Props> = ({ route }) => {
  const { matchId, partnerName } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { user } = useAuth();

  const loadMessages = useCallback(async () => {
    try {
      const response = await messageApi.getMessages(matchId);
      const formattedMessages = response.messages.map(transformMessage).reverse();
      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const transformMessage = (message: Message): IMessage => {
    return {
      _id: message._id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.senderId,
        name: message.senderId === user!.id ? user!.name : partnerName,
      } as GiftedChatUser,
    };
  };

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    if (!message || !message.text?.trim()) return;

    // Optimistically add message to UI
    setMessages(previousMessages => 
      GiftedChat.append(previousMessages, newMessages)
    );

    try {
      await messageApi.sendMessage(matchId, message.text);
      // Message was sent successfully, no need to update UI again
    } catch (error: any) {
      // Remove the optimistic message and show error
      setMessages(previousMessages => 
        previousMessages.filter(msg => msg._id !== message._id)
      );
      Alert.alert('Error', 'Failed to send message');
    }
  }, [matchId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chatContainer: {
      flex: 1,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user!.id,
          name: user!.name,
        }}
        placeholder="Type a message..."
        alwaysShowSend
        renderAvatar={() => null}
        messagesContainerStyle={{
          backgroundColor: theme.colors.background,
        }}
        textInputStyle={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          marginHorizontal: 8,
          maxHeight: 100,
        }}
        inputContainerStyle={{
          backgroundColor: theme.colors.surface,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        }}
        sendButtonProps={{
          containerStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 8,
          },
        }}
        timeTextStyle={{
          left: {
            color: theme.colors.text,
            opacity: 0.5,
          },
          right: {
            color: theme.colors.text,
            opacity: 0.5,
          },
        }}
        bubbleProps={{
          left: {
            wrapperStyle: {
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: '#e0e0e0',
            },
            textStyle: {
              color: theme.colors.text,
            },
          },
          right: {
            wrapperStyle: {
              backgroundColor: theme.colors.primary,
            },
            textStyle: {
              color: '#ffffff',
            },
          },
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;