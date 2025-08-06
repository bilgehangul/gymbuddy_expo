import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { sessionApi } from '../../services/api';
import { Session } from '../../types';
import { MainStackParamList } from '../../navigation/AppNavigator';

type SessionFormScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'SessionForm'>;
type SessionFormScreenRouteProp = RouteProp<MainStackParamList, 'SessionForm'>;

interface Props {
  navigation: SessionFormScreenNavigationProp;
  route: SessionFormScreenRouteProp;
}

const SessionFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { sessionId } = route.params;
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date(),
    time: '09:00',
    duration: 60,
    workoutType: 'strength',
    preferredAgeMin: 18,
    preferredAgeMax: 30,
    preferredGender: 'any' as 'male' | 'female' | 'any',
    gym: '',
    description: '',
  });

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setIsLoading(true);
      const response = await sessionApi.getMySessions();
      const session = response.sessions.find(s => s._id === sessionId);
      if (session) {
        setFormData({
          date: new Date(session.date),
          time: session.time,
          duration: session.duration,
          workoutType: session.workoutType,
          preferredAgeMin: session.preferredAgeMin,
          preferredAgeMax: session.preferredAgeMax,
          preferredGender: session.preferredGender,
          gym: session.gym,
          description: session.description || '',
        });
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load session');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    if (!formData.gym.trim()) {
      Alert.alert('Error', 'Please enter a gym location');
      return false;
    }

    if (formData.duration < 30 || formData.duration > 180) {
      Alert.alert('Error', 'Duration must be between 30 and 180 minutes');
      return false;
    }

    if (formData.preferredAgeMin < 18 || formData.preferredAgeMax > 100) {
      Alert.alert('Error', 'Age range must be between 18 and 100');
      return false;
    }

    if (formData.preferredAgeMin >= formData.preferredAgeMax) {
      Alert.alert('Error', 'Minimum age must be less than maximum age');
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert('Error', 'Session date cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const sessionData = {
        ...formData,
        date: formatDate(formData.date),
      };

      if (sessionId) {
        await sessionApi.updateSession(sessionId, sessionData);
        Alert.alert('Success', 'Session updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await sessionApi.createSession(sessionData);
        Alert.alert('Success', 'Session created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.join('\n') || 
                          error.response?.data?.error || 
                          'Failed to save session';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateFormData('date', selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      updateFormData('time', `${hours}:${minutes}`);
    }
  };

  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: 20,
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
    dateTimeButton: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
    },
    dateTimeText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      marginTop: 20,
    },
    rangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    rangeInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
      marginHorizontal: 8,
      textAlign: 'center',
    },
    rangeLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateTimeText}>
          Date: {formData.date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.dateTimeText}>
          Time: {formData.time}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={parseTime(formData.time)}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        value={formData.duration.toString()}
        onChangeText={(value) => updateFormData('duration', parseInt(value) || 60)}
        keyboardType="numeric"
      />

      <View style={styles.picker}>
        <Picker
          selectedValue={formData.workoutType}
          onValueChange={(value) => updateFormData('workoutType', value)}
        >
          <Picker.Item label="Strength Training" value="strength" />
          <Picker.Item label="Cardio" value="cardio" />
          <Picker.Item label="Flexibility" value="flexibility" />
          <Picker.Item label="Sports" value="sports" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Gym Location *"
        value={formData.gym}
        onChangeText={(value) => updateFormData('gym', value)}
      />

      <Text style={styles.sectionTitle}>Partner Preferences</Text>

      <Text style={styles.rangeLabel}>Age Range</Text>
      <View style={styles.rangeContainer}>
        <TextInput
          style={styles.rangeInput}
          placeholder="Min"
          value={formData.preferredAgeMin.toString()}
          onChangeText={(value) => updateFormData('preferredAgeMin', parseInt(value) || 18)}
          keyboardType="numeric"
        />
        <Text style={styles.rangeLabel}>to</Text>
        <TextInput
          style={styles.rangeInput}
          placeholder="Max"
          value={formData.preferredAgeMax.toString()}
          onChangeText={(value) => updateFormData('preferredAgeMax', parseInt(value) || 30)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.picker}>
        <Picker
          selectedValue={formData.preferredGender}
          onValueChange={(value) => updateFormData('preferredGender', value)}
        >
          <Picker.Item label="Any Gender" value="any" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={formData.description}
        onChangeText={(value) => updateFormData('description', value)}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Saving...' : sessionId ? 'Update Session' : 'Create Session'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SessionFormScreen;