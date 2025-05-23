import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useVizbeeSession } from "../hooks/useVizbeeSession";
import { useVizbeeMedia } from "../hooks/useVizbeeMedia";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import { VideoPlayer } from "../components/VideoPlayer";
import { CastingOverlay } from "../components/CastingOverlay";
import { VideoListItem } from "../components/VideoListItem";
import { videos } from "../constants/VideoListContent";
import { Colors } from '../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { SMART_PLAY_OPTIONS } from "../screens/SettingsScreen";

const Back = require("../../assets/back.png");

export const PlayerScreen = ({ route, navigation }: any) => {
  const { 
    video: initialVideo, 
    resumePosition: initialResumePosition = 0,
  } = route.params;

  // Track whether we've returned from settings
  const [returnedFromSettings, setReturnedFromSettings] = useState(false);
  const [shouldInvokeSmartPlay, setShouldInvokeSmartPlay] = useState(false);

  const {
    currentVideo,
    isFullscreen,
    videoRef,
    toggleFullscreen,
    invokeSmartPlay,
    onSelectVideo,
    initialPosition,
    setInitialPosition,
    isConfigLoaded,
    selectedSmartPlayOptionId,
  } = useVideoPlayer(initialVideo, initialResumePosition);

  const {
    castingPosition,
    lastCastingGuid,
    resetLastCastingGuidAndCastingPosition,
  } = useVizbeeMedia();
  const { isCasting, castingDevice, castingState } = useVizbeeSession();

  // Track screen focus for returning from settings
  useFocusEffect(
    useCallback(() => {
      console.info("Player screen focused with returnedFromSettings:", returnedFromSettings);
      if (returnedFromSettings) {
        // If we're returning to the screen, set flag to trigger SmartPlay
        setShouldInvokeSmartPlay(true);
      } else {
        setReturnedFromSettings(true);
      }
      
      return () => {
        console.info("Player screen unfocused");
      };
    }, [returnedFromSettings])
  );

  // Effect to handle invoking SmartPlay when returning from settings
  useEffect(() => {
    if (shouldInvokeSmartPlay && isConfigLoaded) {
      console.info("Re-invoking SmartPlay after returning from settings");
      invokeSmartPlay(currentVideo);
      setShouldInvokeSmartPlay(false);
    }
  }, [shouldInvokeSmartPlay, isConfigLoaded, currentVideo, invokeSmartPlay]);

  useEffect(() => {
    if (castingState === "CONNECTED") {
      invokeSmartPlay(currentVideo);
    } else if (castingState === "NOT_CONNECTED" && videoRef.current) {
      videoRef.current.resume();
    }
  }, [castingState, videoRef.current, currentVideo, invokeSmartPlay]);

  useEffect(() => {
    if (lastCastingGuid === currentVideo.guid) {
      setInitialPosition(initialResumePosition || castingPosition);
    }
  }, [lastCastingGuid, castingPosition, currentVideo.guid]);

  // Initial invocation of SmartPlay when configuration is first loaded
  useEffect(() => {
    if (isConfigLoaded && !returnedFromSettings) {
      console.info("Initial configuration loaded - invoking SmartPlay");
      invokeSmartPlay(currentVideo);
    }
  }, [isConfigLoaded, currentVideo, invokeSmartPlay, returnedFromSettings]);

  useEffect(() => {
    if (isCasting) {
      videoRef.current?.pause();
    }
  }, [isCasting]);

  const filteredVideos = videos.filter((v) => v.guid !== currentVideo.guid);

  const resetInitialVideoPosition = () => {
    setInitialPosition(0);
    resetLastCastingGuidAndCastingPosition();
  };

  // Get the current option name for display
  const getCurrentOptionName = () => {
    const option = SMART_PLAY_OPTIONS.find(opt => opt.id === selectedSmartPlayOptionId);
    return option ? option.name : "Unknown";
  };

  const handleSettingsPress = () => {
    console.info("Navigating to Settings");
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="lightblue"
        barStyle="dark-content"
        hidden={isFullscreen}
      />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Back} style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vizbee</Text>
        </View>
        
        {/* Display current SmartPlay option */}
        <TouchableOpacity 
          onPress={handleSettingsPress}
          style={styles.optionIndicator}
        >
          <Text style={styles.optionText}>{getCurrentOptionName()}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}
      >
        {isCasting ? (
          <CastingOverlay
            castingDevice={castingDevice}
            thumbnail={currentVideo.imageUrl}
          />
        ) : (
          <VideoPlayer
            video={currentVideo}
            videoRef={videoRef}
            key={currentVideo.guid}
            toggleFullscreen={toggleFullscreen}
            startPosition={initialPosition}
            resetInitialVideoPosition={resetInitialVideoPosition}
          />
        )}
      </View>
      {!isFullscreen && (
        <FlatList
          data={filteredVideos}
          renderItem={({ item }) => (
            <VideoListItem item={item} onPress={() => onSelectVideo(item)} />
          )}
          keyExtractor={(item) => item.guid}
          style={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.headerBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    height: 56,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    paddingLeft: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    paddingHorizontal: 10,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  fullscreenVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  optionIndicator: {
    padding: 8,
    backgroundColor: Colors.primary + '20',
    borderRadius: 4,
  },
  optionText: {
    fontSize: 12,
    color: Colors.primary,
  },
});