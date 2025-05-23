import { useState, useRef, useCallback, useEffect } from "react";
import { VideoRef } from "react-native-video";
// @ts-ignore
import { VizbeeManager, VizbeeVideo, VizbeeSmartPlayOptions, VizbeeSmartPlayCardVisibility } from "react-native-vizbee-sender-sdk";
import { VideoItem } from "../types/VideoItem";
import { Storage } from "../utils/Storage";
import { SMART_PLAY_OPTION_KEY, SMART_PLAY_OPTIONS } from "../screens/SettingsScreen";
import { useFocusEffect } from "@react-navigation/native";

// Delay in milliseconds before calling smartPlay
const SMART_PLAY_DELAY = 1000; // 1 second

export const useVideoPlayer = (
  initialVideo: VideoItem,
  initialResumePosition: number,
  initialSmartPlayOptionId?: number | null
) => {
  const [currentVideo, setCurrentVideo] = useState(initialVideo);
  const [initialPosition, setInitialPosition] = useState(initialResumePosition);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSmartPlayOptionId, setSelectedSmartPlayOptionId] = useState<number | null>(
    initialSmartPlayOptionId !== undefined ? initialSmartPlayOptionId : 1
  );
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const videoRef = useRef<VideoRef>(null);
  
  // Function to load the SmartPlay option from storage
  const loadSmartPlayOption = useCallback(async () => {
    try {
      console.info("Loading SmartPlay option from storage...");
      const savedOptionId = await Storage.getItem(SMART_PLAY_OPTION_KEY);
      if (savedOptionId) {
        const optionId = parseInt(savedOptionId, 10);
        console.info(`Loaded SmartPlay option ID ${optionId} from storage`);
        setSelectedSmartPlayOptionId(optionId);
      } else {
        console.info("No SmartPlay option found in storage, using default");
      }
    } catch (error) {
      console.error("Error loading SmartPlay option:", error);
    } finally {
      // Mark configuration as loaded
      setIsConfigLoaded(true);
    }
  }, []);

  // Initial load of the SmartPlay option
  useEffect(() => {
    console.info("Initial loading of SmartPlay option");
    loadSmartPlayOption();
  }, [loadSmartPlayOption]);

  // Refresh configuration when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.info("Screen focused - refreshing SmartPlay configuration");
      // Always reload the configuration from storage when the screen comes into focus
      loadSmartPlayOption();
      
      return () => {
        console.info("Screen unfocused");
      };
    }, [loadSmartPlayOption])
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const invokeSmartPlay = useCallback(async (video: VideoItem) => {
    console.info("Preparing to invoke Smart Play for video:", video.guid);
    
    if (!isConfigLoaded) {
      console.info("Waiting for SmartPlay config to be loaded...");
      // Wait for config to load
      return;
    }

    const position = await videoRef.current
      ?.getCurrentPosition()
      .then((position) => position || 0)
      .catch(() => 0);

    const vizbeeVideo = new VizbeeVideo();
    vizbeeVideo.guid = video.guid;
    vizbeeVideo.title = video.title;
    vizbeeVideo.subtitle = video.subtitle;
    vizbeeVideo.imageUrl = video.imageUrl;
    vizbeeVideo.streamUrl = video.streamUrl;
    vizbeeVideo.isLive = video.isLive;
    vizbeeVideo.startPositionInSeconds = position;

    // Find the selected option
    const selectedOption = SMART_PLAY_OPTIONS.find(opt => opt.id === selectedSmartPlayOptionId);
    console.info(`Using SmartPlay option: ${selectedOption?.name} (ID: ${selectedSmartPlayOptionId})`);

    // Schedule the SmartPlay call with a delay
    console.info(`Scheduling SmartPlay with a ${SMART_PLAY_DELAY}ms delay...`);
    
    setTimeout(() => {
      if (selectedOption?.value === null) {
        // Use the original API without options
        console.info("Invoking Smart Play without options after delay");
        setTimeout(() => {
          VizbeeManager.smartPlay(
            vizbeeVideo,
            (_: any) => {
              console.info("Smart Play succeeded on TV");
            },
            (_: any) => {
              console.info("Smart Play falling back to phone");
              videoRef.current?.resume();
            }
          );
        }, 500);
      } else {
        // Create options with specific settings
        console.info("Creating Smart Play Options with visibility:", selectedOption?.value);
        const smartPlayOptions = new VizbeeSmartPlayOptions();
        smartPlayOptions.isFromSmartNotification = true;
        smartPlayOptions.smartPlayCardVisibility = selectedOption?.value;

        console.info("Invoking Smart Play with options after delay:", JSON.stringify({
          isFromSmartNotification: smartPlayOptions.isFromSmartNotification,
          smartPlayCardVisibility: smartPlayOptions.smartPlayCardVisibility
        }));
        
        setTimeout(() => {
          VizbeeManager.smartPlay(
            vizbeeVideo,
            (_: any) => {
              console.info("Smart Play with options succeeded on TV");
            },
            (_: any) => {
              console.info("Smart Play with options falling back to phone");
              videoRef.current?.resume();
            },
            smartPlayOptions
          );
        }, 500);
      }
    }, SMART_PLAY_DELAY);
    
  }, [selectedSmartPlayOptionId, isConfigLoaded]);

  const onSelectVideo = useCallback(
    (item: VideoItem) => {
      setCurrentVideo(item);
      invokeSmartPlay(item);
    },
    [invokeSmartPlay]
  );

  // Add an effect to monitor selectedSmartPlayOptionId changes
  useEffect(() => {
    console.info(`SmartPlayOptionId changed to: ${selectedSmartPlayOptionId}`);
  }, [selectedSmartPlayOptionId]);

  return {
    currentVideo,
    isFullscreen,
    videoRef,
    toggleFullscreen,
    invokeSmartPlay,
    onSelectVideo,
    initialPosition,
    setInitialPosition,
    isConfigLoaded,
    selectedSmartPlayOptionId,  // Expose this so we can display it if needed
  };
};