import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { matchApi, messageApi } from '../../services/api';
import { Match, Message } from '../../types';
import { MainStackParamList } from '../../navigation/AppNavigator';

type ChatListScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface Props {
  navigation: ChatListScreenNavigationProp;
}

interface ChatPreview {
  match: Match;
  lastMessage?: Message;
  unreadCount: number;
  partnerName: string;
  partnerPhoto?: string;
}

const ChatListScreen: React.FC<Props> = ({ navigation }) => {
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();

  const loadChats = async () => {
    try {
      const matchesResponse = await matchApi.getMatches();
      const acceptedMatches = matchesResponse.matches.filter(
        match => match.status === 'accepted'
      );

      const chatPreviewsPromises = acceptedMatches.map(async (match) => {
        try {
          const messagesResponse = await messageApi.getMessages(match._id);
          const messages = messagesResponse.messages;
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
          
          const unreadCount = messages.filter(
            msg => !msg.readBy.includes(user!.id) && msg.senderId !== user!.id
          ).length;

          const partner = match.userA.id === user!.id ? match.userB : match.userA;

          return {
            match,
            lastMessage,
            unreadCount,
            partnerName: partner.name,
            partnerPhoto: partner.photoUrl,
          };
        } catch (error) {
          console.error(`Error loading messages for match ${match._id}:`, error);
          const partner = match.userA.id === user!.id ? match.userB : match.userA;
          return {
            match,
            lastMessage: undefined,
            unreadCount: 0,
            partnerName: partner.name,
            partnerPhoto: partner.photoUrl,
          };
        }
      });

      const previews = await Promise.all(chatPreviewsPromises);
      previews.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
      });

      setChatPreviews(previews);
    } catch (error: any) {
      console.error('Error loading chats:', error);
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const renderChatPreview = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatScreen', {
        matchId: item.match._id,
        partnerName: item.partnerName,
      })}
    >
      <View style={styles.chatAvatar}>
        {item.partnerPhoto ? (
          <Image source={{ uri: item.partnerPhoto }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.partnerName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.partnerName}>{item.partnerName}</Text>
          {item.lastMessage && (
            <Text style={styles.timestamp}>
              {formatTimestamp(item.lastMessage.timestamp)}
            </Text>
          )}
        </View>

        <View style={styles.sessionInfo}>
          <Text style={styles.sessionText}>
            {item.match.sessionA.workoutType.charAt(0).toUpperCase() + 
             item.match.sessionA.workoutType.slice(1)} at {item.match.sessionA.gym}
          </Text>
        </View>

        {item.lastMessage ? (
          <Text style={[
            styles.lastMessage,
            item.unreadCount > 0 && styles.unreadMessage
          ]} numberOfLines={1}>
            {item.lastMessage.senderId === user!.id ? 'You: ' : ''}
            {item.lastMessage.text}
          </Text>
        ) : (
          <Text style={styles.noMessages}>Start your conversation!</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: 'center',
    },
    chatItem: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      backgroundColor: theme.colors.surface,
    },
    chatAvatar: {
      position: 'relative',
      marginRight: 12,
    },
    avatarImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    avatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    unreadBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#ef4444',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    chatContent: {
      flex: 1,
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    partnerName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.text,
      opacity: 0.5,
    },
    sessionInfo: {
      marginBottom: 4,
    },
    sessionText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    lastMessage: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    unreadMessage: {
      fontWeight: '500',
      opacity: 1,
    },
    noMessages: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.5,
      fontStyle: 'italic',
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (chatPreviews.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Conversations</Text>
          <Text style={styles.emptyDescription}>
            Accept matches to start chatting with your workout partners!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatPreviews}
        renderItem={renderChatPreview}
        keyExtractor={(item) => item.match._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default ChatListScreen;