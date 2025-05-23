import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { headerStyles } from '../styles/HeaderStyles';
import { Colors } from '../constants/Colors';
import { SmartPlayOption } from './SettingsScreen';

type SmartPlayOptionsScreenProps = NativeStackScreenProps<RootStackParamList, 'SmartPlayOptions'>;

export const SmartPlayOptionsScreen: React.FC<SmartPlayOptionsScreenProps> = ({ navigation, route }) => {
  const { options, selectedOption, onSelect } = route.params;

  const handleOptionSelect = (option: SmartPlayOption) => {
    onSelect(option);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={headerStyles.backButton}
        >
          <Text style={headerStyles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>SmartPlay Card Options</Text>
      </View>

      <ScrollView>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              selectedOption.id === option.id && styles.selectedOption
            ]}
            onPress={() => handleOptionSelect(option)}
          >
            <Text 
              style={[
                styles.optionText,
                selectedOption.id === option.id && styles.selectedOptionText
              ]}
            >
              {option.name}
            </Text>
            {selectedOption.id === option.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceBackground,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  optionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});