import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from "react-native";
import {
  VizbeeCastButton,
  VizbeeManager,
  //@ts-ignore
} from "react-native-vizbee-sender-sdk";
import { 
  AppStateMonitor 
  //@ts-ignore
} from "react-native-app-state-monitor";
import { VizbeeHomeSSOManager } from "react-native-vizbee-homesso-sender-sdk";
import { RNDemoAppVizbeeHomeSSODelegate } from "../homesso/RNDemoAppVizbeeHomeSSODelegate";
import { VideoList } from "../components/VideoList";
import { useVizbeeSession } from "../hooks/useVizbeeSession";
import { useVizbeeMedia } from "../hooks/useVizbeeMedia";
import { useVizbeeCastIconState } from "../hooks/useVizbeeCastIconState";
import { videos } from "../constants/VideoListContent";
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { MobileToTVMessager } from '../message/MobileToTVMessager';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { castingState } = useVizbeeSession();
  const { castIconState } = useVizbeeCastIconState();
  const { castingPosition, lastCastingGuid } = useVizbeeMedia();
  const [mobileToTVMessager] = useState(() => new MobileToTVMessager());
  const [appState, setAppState] = useState(AppStateMonitor.currentState);
  let homeSSOManager: VizbeeHomeSSOManager | undefined = undefined;

  // App state change handler
  const handleAppStateChange = useCallback((newState: string) => {
    console.log(`App state changed to: ${newState}`);
    setAppState(newState);
  }, []);

  useEffect(() => {
    // Set up app state listener
    const unsubscribe = AppStateMonitor.addEventListener(handleAppStateChange);

    // Initial setup
    if (!homeSSOManager) {
      homeSSOManager = VizbeeHomeSSOManager.getInstance();
      homeSSOManager.enableLogging(true);
      homeSSOManager.initialize(new RNDemoAppVizbeeHomeSSODelegate());
    }

    VizbeeManager.enableLogging();
    // Initialize mobile to TV messaging
    mobileToTVMessager.listenForTVConnectionState();

    setTimeout(() => {
      VizbeeManager.smartPrompt();
    }, 2000);

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [handleAppStateChange]);

  useEffect(() => {
    if (castingState === "NOT_CONNECTED" && lastCastingGuid) {
      const videoItem = videos.find((video) => video.guid === lastCastingGuid);

      if (videoItem) {
        navigation.navigate("Player", {
          video: videoItem,
          resumePosition: castingPosition,
        });
      }
    }
  }, [castingState, lastCastingGuid, castingPosition, navigation]);

  // Log cast icon state changes
  useEffect(() => {
    console.log(`Current cast icon state: ${castIconState}`);
  }, [castIconState]);

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vizbee</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <View style={styles.castContainer}>
            <VizbeeCastButton style={styles.castButton} />
          </View>
        </View>
      </View>
      <VideoList navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    width: "100%",
  },
  header: {
    backgroundColor: Colors.headerBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    marginRight: 16,
    padding: 4,
    width: 32,
    height: 32,
  },
  settingsIcon: {
    fontSize: 20,
  },
  castContainer: {
    marginRight: 16,
  },
  castButton: {
    width: 32,
    height: 32,
  },
});