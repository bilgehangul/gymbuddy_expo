import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 40,
      color: theme.colors.text,
      opacity: 0.8,
    },
    feature: {
      marginBottom: 24,
      alignItems: 'center',
    },
    featureTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.colors.text,
    },
    featureDescription: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.text,
      opacity: 0.7,
      lineHeight: 22,
    },
    buttonContainer: {
      padding: 20,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome to GymBuddy!</Text>
        <Text style={styles.subtitle}>Your perfect workout partner is just a match away</Text>

        <View style={styles.feature}>
          <Text style={styles.featureTitle}>🎯 Smart Matching</Text>
          <Text style={styles.featureDescription}>
            Get matched with compatible workout partners based on your preferences, schedule, and location
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureTitle}>💬 Real-time Chat</Text>
          <Text style={styles.featureDescription}>
            Connect instantly with your matches and plan your workout sessions together
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureTitle}>🏫 School-based Community</Text>
          <Text style={styles.featureDescription}>
            Find workout partners from your university with custom themes and local gym preferences
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureTitle}>⚡ Quick Sessions</Text>
          <Text style={styles.featureDescription}>
            Create workout sessions in seconds and get matched within 24 hours
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;