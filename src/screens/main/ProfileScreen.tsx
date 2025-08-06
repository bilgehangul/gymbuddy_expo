import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { MainStackParamList } from '../../navigation/AppNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    profileImageText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    school: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.7,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.7,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    description: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 22,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      margin: 20,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    logoutButton: {
      backgroundColor: '#dc3545',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      margin: 20,
      marginTop: 0,
    },
    workoutTypes: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    workoutType: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    workoutTypeText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {user.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.school}>{user.school}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{calculateAge(user.birthday)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Home Gym</Text>
            <Text style={styles.infoValue}>{user.homeGym}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Motivation</Text>
            <Text style={styles.infoValue}>{user.motivation}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age Range</Text>
            <Text style={styles.infoValue}>
              {user.preferences.ageMin || 'N/A'} - {user.preferences.ageMax || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Preferred Gender</Text>
            <Text style={styles.infoValue}>
              {user.preferences.preferredGender === 'any' ? 'Any' : 
               user.preferences.preferredGender?.charAt(0).toUpperCase() + 
               user.preferences.preferredGender?.slice(1) || 'Not specified'}
            </Text>
          </View>
          <Text style={styles.infoLabel}>Workout Types</Text>
          <View style={styles.workoutTypes}>
            {user.preferences.workoutTypes.map((type) => (
              <View key={type} style={styles.workoutType}>
                <Text style={styles.workoutTypeText}>
                  {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {user.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.description}>{user.description}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;