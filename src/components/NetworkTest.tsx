import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getTestUrls, getConnectionTips } from '../utils/networkConfig';

const NetworkTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const { theme } = useTheme();

  const testConnection = async () => {
    setIsLoading(true);
    setResult('');

    try {
      // Test different API URLs
      const urls = getTestUrls();

      for (const url of urls) {
        try {
          console.log(`Testing: ${url}`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            setResult(`✅ SUCCESS: ${url}\nResponse: ${JSON.stringify(data)}`);
            return;
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log(`Failed: ${url} - Connection timeout`);
          } else {
            console.log(`Failed: ${url} - ${error.message}`);
          }
        }
      }
      
      setResult(`❌ All connection attempts failed.\n\n${getConnectionTips()}`);
    } catch (error: any) {
      setResult(`❌ Network test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      margin: 20,
      borderRadius: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    result: {
      fontSize: 14,
      color: theme.colors.text,
      backgroundColor: '#f5f5f5',
      padding: 12,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Connection Test</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={testConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </Text>
      </TouchableOpacity>
      {result ? <Text style={styles.result}>{result}</Text> : null}
    </View>
  );
};

export default NetworkTest;