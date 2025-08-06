import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { userApi } from '../../services/api';
import { MainStackParamList } from '../../navigation/AppNavigator';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'EditProfile'>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    homeGym: user?.homeGym || '',
    motivation: user?.motivation || '',
    description: user?.description || '',
    preferences: {
      ageMin: user?.preferences.ageMin || 18,
      ageMax: user?.preferences.ageMax || 30,
      preferredGender: user?.preferences.preferredGender || 'any',
      workoutTypes: user?.preferences.workoutTypes || [],
    },
  });

  const workoutTypeOptions = ['strength', 'cardio', 'flexibility', 'sports'];

  const updateFormData = (key: string, value: any) => {
    if (key.startsWith('preferences.')) {
      const prefKey = key.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const toggleWorkoutType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        workoutTypes: prev.preferences.workoutTypes.includes(type)
          ? prev.preferences.workoutTypes.filter(t => t !== type)
          : [...prev.preferences.workoutTypes, type],
      },
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('photo', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);

        const response = await userApi.uploadPhoto(formData);
        updateUser(response.user);
        Alert.alert('Success', 'Profile photo updated successfully');
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || 'Failed to upload photo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.homeGym.trim() || !formData.motivation.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.preferences.workoutTypes.length === 0) {
      Alert.alert('Error', 'Please select at least one workout type');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userApi.updateProfile(formData);
      updateUser(response.user);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
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
    header: {
      alignItems: 'center',
      marginBottom: 30,
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
    changePhotoButton: {
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
    },
    changePhotoText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      marginTop: 20,
    },
    workoutTypesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    workoutTypeButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    workoutTypeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    workoutTypeText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    workoutTypeTextActive: {
      color: '#ffffff',
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
      <View style={styles.header}>
        {user?.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={formData.name}
        onChangeText={(value) => updateFormData('name', value)}
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
        placeholder="Bio"
        value={formData.description}
        onChangeText={(value) => updateFormData('description', value)}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.sectionTitle}>Preferences</Text>

      <Text style={styles.rangeLabel}>Age Range</Text>
      <View style={styles.rangeContainer}>
        <TextInput
          style={styles.rangeInput}
          placeholder="Min"
          value={formData.preferences.ageMin.toString()}
          onChangeText={(value) => updateFormData('preferences.ageMin', parseInt(value) || 18)}
          keyboardType="numeric"
        />
        <Text style={styles.rangeLabel}>to</Text>
        <TextInput
          style={styles.rangeInput}
          placeholder="Max"
          value={formData.preferences.ageMax.toString()}
          onChangeText={(value) => updateFormData('preferences.ageMax', parseInt(value) || 30)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.picker}>
        <Picker
          selectedValue={formData.preferences.preferredGender}
          onValueChange={(value) => updateFormData('preferences.preferredGender', value)}
        >
          <Picker.Item label="Any Gender" value="any" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <Text style={styles.rangeLabel}>Workout Types</Text>
      <View style={styles.workoutTypesContainer}>
        {workoutTypeOptions.map((type) => {
          const isSelected = formData.preferences.workoutTypes.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.workoutTypeButton,
                isSelected && styles.workoutTypeButtonActive,
              ]}
              onPress={() => toggleWorkoutType(type)}
            >
              <Text
                style={[
                  styles.workoutTypeText,
                  isSelected && styles.workoutTypeTextActive,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;