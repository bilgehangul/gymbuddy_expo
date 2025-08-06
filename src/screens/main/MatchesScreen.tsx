import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { sessionApi, matchApi } from '../../services/api';
import { MatchCandidate, Match } from '../../types';

const MatchesScreen: React.FC = () => {
  const [potentialMatches, setPotentialMatches] = useState<MatchCandidate[]>([]);
  const [acceptedMatches, setAcceptedMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const { theme } = useTheme();

  const loadData = async () => {
    try {
      const [sessionsResponse, matchesResponse] = await Promise.all([
        sessionApi.getSessions(),
        matchApi.getMatches(),
      ]);

      setPotentialMatches(sessionsResponse.potentialMatches || []);
      setAcceptedMatches(matchesResponse.matches || []);
    } catch (error: any) {
      console.error('Error loading matches:', error);
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAcceptMatch = async (matchCandidate: MatchCandidate) => {
    try {
      // This would need to be implemented in the backend to create a match from candidates
      Alert.alert('Feature Coming Soon', 'Match acceptance will be implemented with the full matching system');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to accept match');
    }
  };

  const handleDeclineMatch = (matchCandidate: MatchCandidate) => {
    Alert.alert(
      'Decline Match',
      'Are you sure you want to decline this match?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setPotentialMatches(prev => 
              prev.filter(m => m.session._id !== matchCandidate.session._id)
            );
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const renderPotentialMatch = (matchCandidate: MatchCandidate) => (
    <View key={matchCandidate.session._id} style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.userInfo}>
          {matchCandidate.user.photoUrl ? (
            <Image source={{ uri: matchCandidate.user.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {matchCandidate.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{matchCandidate.user.name}</Text>
            <Text style={styles.userAge}>
              {calculateAge(matchCandidate.user.birthday)} years old
            </Text>
            <Text style={styles.userSchool}>{matchCandidate.user.school}</Text>
          </View>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{matchCandidate.score}%</Text>
          <Text style={styles.scoreLabel}>Match</Text>
        </View>
      </View>

      <View style={styles.sessionInfo}>
        <Text style={styles.workoutType}>
          {matchCandidate.session.workoutType.charAt(0).toUpperCase() + 
           matchCandidate.session.workoutType.slice(1)} Training
        </Text>
        <Text style={styles.sessionDetails}>
          {formatDate(matchCandidate.session.date)} at {formatTime(matchCandidate.session.time)}
        </Text>
        <Text style={styles.sessionGym}>{matchCandidate.session.gym}</Text>
      </View>

      {matchCandidate.reasons.length > 0 && (
        <View style={styles.reasonsContainer}>
          <Text style={styles.reasonsTitle}>Why you match:</Text>
          {matchCandidate.reasons.map((reason, index) => (
            <Text key={index} style={styles.reason}>• {reason}</Text>
          ))}
        </View>
      )}

      {matchCandidate.session.description && (
        <Text style={styles.sessionDescription}>
          {matchCandidate.session.description}
        </Text>
      )}

      <View style={styles.matchActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => handleDeclineMatch(matchCandidate)}
        >
          <Ionicons name="close" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptMatch(matchCandidate)}
        >
          <Ionicons name="heart" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Match</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAcceptedMatch = (match: Match) => (
    <View key={match._id} style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.userInfo}>
          {match.userA.photoUrl ? (
            <Image source={{ uri: match.userA.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {match.userA.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{match.userA.name}</Text>
            <Text style={styles.userSchool}>{match.userA.school}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {match.status === 'accepted' ? 'Matched!' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.sessionInfo}>
        <Text style={styles.workoutType}>
          {match.sessionA.workoutType.charAt(0).toUpperCase() + 
           match.sessionA.workoutType.slice(1)} Training
        </Text>
        <Text style={styles.sessionDetails}>
          {formatDate(match.sessionA.date)} at {formatTime(match.sessionA.time)}
        </Text>
        <Text style={styles.sessionGym}>{match.sessionA.gym}</Text>
      </View>

      {match.status === 'accepted' && (
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubbles" size={16} color="#ffffff" />
          <Text style={styles.chatButtonText}>Start Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    tabButton: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      opacity: 0.7,
    },
    activeTabText: {
      color: theme.colors.primary,
      opacity: 1,
      fontWeight: '600',
    },
    content: {
      flex: 1,
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
    matchesList: {
      padding: 20,
    },
    matchCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    matchHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    userInfo: {
      flexDirection: 'row',
      flex: 1,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    userAge: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    userSchool: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    scoreContainer: {
      alignItems: 'center',
    },
    scoreText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    scoreLabel: {
      fontSize: 12,
      color: theme.colors.text,
      opacity: 0.7,
    },
    statusBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    sessionInfo: {
      marginBottom: 16,
    },
    workoutType: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    sessionDetails: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
      marginBottom: 2,
    },
    sessionGym: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    reasonsContainer: {
      marginBottom: 16,
    },
    reasonsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    reason: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.8,
      marginBottom: 2,
    },
    sessionDescription: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.8,
      marginBottom: 16,
      fontStyle: 'italic',
    },
    matchActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    declineButton: {
      backgroundColor: '#ef4444',
    },
    acceptButton: {
      backgroundColor: '#22c55e',
    },
    actionButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    chatButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
    },
    chatButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'discover' && styles.activeTab]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'matches' && styles.activeTab]}
          onPress={() => setActiveTab('matches')}
        >
          <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
            My Matches
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'discover' ? (
          potentialMatches.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Matches Found</Text>
              <Text style={styles.emptyDescription}>
                Create more workout sessions to find potential matches!
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.matchesList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {potentialMatches.map(renderPotentialMatch)}
            </ScrollView>
          )
        ) : (
          acceptedMatches.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Matches Yet</Text>
              <Text style={styles.emptyDescription}>
                Accept some matches to start connecting with workout partners!
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.matchesList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {acceptedMatches.map(renderAcceptedMatch)}
            </ScrollView>
          )
        )}
      </View>
    </View>
  );
};

export default MatchesScreen;