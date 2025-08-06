import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { userApi } from '../../services/api';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    school: '',
    gender: 'male' as 'male' | 'female' | 'other',
    birthday: '',
    homeGym: '',
    motivation: '',
    description: '',
  });
  const [schools, setSchools] = useState<Array<{ school: string; displayName: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const response = await userApi.getSchools();
      setSchools(response.schools);
    } catch (error) {
      console.error('Error loading schools:', error);
      // Fallback to static schools
      const staticSchools = [
        { school: 'stanford', displayName: 'Stanford University' },
        { school: 'ucla', displayName: 'UCLA' },
        { school: 'berkeley', displayName: 'UC Berkeley' },
        { school: 'usc', displayName: 'USC' },
      ];
      setSchools(staticSchools);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, name, school, birthday, homeGym, motivation } = formData;

    if (!email.trim() || !password.trim() || !name.trim() || !school || !birthday || !homeGym.trim() || !motivation.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    const birthdayDate = new Date(birthday);
    if (isNaN(birthdayDate.getTime())) {
      Alert.alert('Error', 'Please enter a valid birthday (YYYY-MM-DD)');
      return false;
    }

    const age = Math.floor((Date.now() - birthdayDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      Alert.alert('Error', 'You must be at least 18 years old');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'An error occurred during registration';
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join('\n');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for network errors
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
      color: theme.colors.primary,
      marginTop: 40,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
      color: theme.colors.text,
      opacity: 0.7,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
    },
    picker: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    linkText: {
      color: theme.colors.text,
    },
    link: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Join GymBuddy</Text>
        <Text style={styles.subtitle}>Find your perfect workout partner</Text>

        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChangeText={(value) => updateFormData('confirmPassword', value)}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={formData.name}
          onChangeText={(value) => updateFormData('name', value)}
        />

        <View style={styles.picker}>
          <Picker
            selectedValue={formData.school}
            onValueChange={(value) => updateFormData('school', value)}
          >
            <Picker.Item label="Select School *" value="" />
            {schools.map((school) => (
              <Picker.Item
                key={school.school}
                label={school.displayName}
                value={school.school}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.picker}>
          <Picker
            selectedValue={formData.gender}
            onValueChange={(value) => updateFormData('gender', value)}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Birthday (YYYY-MM-DD) *"
          value={formData.birthday}
          onChangeText={(value) => updateFormData('birthday', value)}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Home Gym *"
          value={formData.homeGym}
          onChangeText={(value) => updateFormData('homeGym', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Workout Motivation *"
          value={formData.motivation}
          onChangeText={(value) => updateFormData('motivation', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Bio (optional)"
          value={formData.description}
          onChangeText={(value) => updateFormData('description', value)}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;