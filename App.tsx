import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  VizbeeCastBar,
  //@ts-ignore
} from "react-native-vizbee-sender-sdk";
import { HomeScreen } from "./src/screens/HomeScreen";
import { PlayerScreen } from "./src/screens/PlayerScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SettingsScreen, SmartPlayOption } from "./src/screens/SettingsScreen";
import { SmartPlayOptionsScreen } from "./src/screens/SmartPlayOptionsScreen";
import { navigationRef } from "./src/utils/NavigationService";

export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  Login: {
    isFromTVSignIn: boolean;
    onSignInComplete?: () => void;
  };
  Settings: undefined;
  SmartPlayOptions: { 
    options: Array<SmartPlayOption>;
    selectedOption: SmartPlayOption;
    onSelect: (option: SmartPlayOption) => void;
  };
};


const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Player"
              component={PlayerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
            name="SmartPlayOptions" 
            component={SmartPlayOptionsScreen}
            options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <VizbeeCastBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;