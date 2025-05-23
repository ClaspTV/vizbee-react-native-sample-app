import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Storage } from '../utils/Storage';
import { AccountManager } from '../account/AccountManager';
import { RootStackParamList } from '../../App';
import { headerStyles } from '../styles/HeaderStyles';
import { Colors } from '../constants/Colors';
import { MobileToTVMessager } from '../message//MobileToTVMessager';
// @ts-ignore
import { VizbeeSmartPlayCardVisibility } from "react-native-vizbee-sender-sdk";

// Create SmartPlay option types
export type SmartPlayOption = {
  id: number;
  name: string;
  value: number | null; // null means no options
};

// Define the SmartPlay options
export const SMART_PLAY_OPTIONS: SmartPlayOption[] = [
  { id: 0, name: 'No Options', value: null },
  { id: 1, name: 'Default Configuration', value: VizbeeSmartPlayCardVisibility.SHOW_HIDE_BASED_ON_CONFIGURATION },
  { id: 2, name: 'Force Show', value: VizbeeSmartPlayCardVisibility.FORCE_SHOW },
  { id: 3, name: 'Force Hide', value: VizbeeSmartPlayCardVisibility.FORCE_HIDE },
];

// Define a key for storing the selected option
export const SMART_PLAY_OPTION_KEY = 'smartPlaySelectedOption';

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSmartPlayOption, setSelectedSmartPlayOption] = useState<SmartPlayOption>(SMART_PLAY_OPTIONS[1]); // Default to Show/Hide based on configuration
  const mobileToTVMessager = useRef(new MobileToTVMessager());

  const checkAuthStatus = useCallback(async () => {
    const authToken = await Storage.getAuthToken();
    setIsSignedIn(Boolean(authToken));
  }, []);

  const onSignInComplete = useCallback(() => {
    checkAuthStatus();
    navigation.goBack();
  }, [navigation, checkAuthStatus]);

  const handleSignInPress = useCallback(() => {
    navigation.navigate('Login', { 
      isFromTVSignIn: false,
      onSignInComplete 
    });
  }, [navigation, onSignInComplete]);

  const handleSignOutPress = async () => {
    setIsLoading(true);
    try {
      const authToken = await Storage.getAuthToken();
      if (authToken) {
        await AccountManager.signOut(authToken);
        await Storage.setAuthToken('');
        setIsSignedIn(false);
        Alert.alert('Success', 'Successfully signed out');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageToTV = async () => {
    const isConnected = await mobileToTVMessager.current.isConnectedToTV();
    
    if (isConnected) {
      const message = mobileToTVMessager.current.getMessage()
      mobileToTVMessager.current.send(
        mobileToTVMessager.current.kEventName,
        message
      );
      Alert.alert('Message Sent', `Message sent to TV with event name: ${mobileToTVMessager.current.kEventName} message: ${JSON.stringify(message)}`);
    } else {
      Alert.alert('Error', 'Not connected to the TV to send the message');
    }
  };

  // Function to navigate to the SmartPlay Options screen
  const handleSmartPlayOptions = () => {
    navigation.navigate('SmartPlayOptions', {
      options: SMART_PLAY_OPTIONS,
      selectedOption: selectedSmartPlayOption,
      onSelect: (option: SmartPlayOption) => {
        setSelectedSmartPlayOption(option);
        // Store the selected option ID
        Storage.setItem(SMART_PLAY_OPTION_KEY, option.id.toString());
      }
    });
  };

  // Load the selected SmartPlay option
  useEffect(() => {
    const loadSmartPlayOption = async () => {
      const savedOptionId = await Storage.getItem(SMART_PLAY_OPTION_KEY);
      if (savedOptionId) {
        const optionId = parseInt(savedOptionId, 10);
        const option = SMART_PLAY_OPTIONS.find(opt => opt.id === optionId);
        if (option) {
          setSelectedSmartPlayOption(option);
        }
      }
    };

    loadSmartPlayOption();
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={headerStyles.backButton}
        >
          <Text style={headerStyles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>Settings</Text>
      </View>
      
      <TouchableOpacity
        style={styles.menuItem}
        onPress={isSignedIn ? handleSignOutPress : handleSignInPress}
        disabled={isLoading}
      >
        <Text style={styles.menuText}>
          {isSignedIn ? 'Sign Out' : 'Sign In'}
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.text.secondary} />
        ) : (
          <Text style={styles.chevron}>›</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={sendMessageToTV}
      >
        <Text style={styles.menuText}>Send Message to TV</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleSmartPlayOptions}
      >
        <View style={styles.optionContainer}>
          <Text style={styles.menuText}>SmartPlay Card Options</Text>
          <Text style={styles.optionValue}>{selectedSmartPlayOption.name}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceBackground,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  chevron: {
    fontSize: 24,
    color: Colors.text.secondary,
  },
  optionContainer: {
    flex: 1,
  },
  optionValue: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});