import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { VideoListItem } from "./VideoListItem";
import { VideoItem } from "../types/VideoItem";
import { videos } from "../constants/VideoListContent";
import { Storage } from "../utils/Storage";
import { SMART_PLAY_OPTION_KEY } from "../screens/SettingsScreen";

interface VideoListProps {
  navigation: any;
}

export const VideoList: React.FC<VideoListProps> = ({ navigation }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  
  useEffect(() => {
    // Load the selected SmartPlay option ID when the component mounts
    const loadSmartPlayOption = async () => {
      try {
        const savedOptionId = await Storage.getItem(SMART_PLAY_OPTION_KEY);
        if (savedOptionId) {
          setSelectedOptionId(parseInt(savedOptionId, 10));
          console.info(`VideoList: Loaded SmartPlay option ID ${savedOptionId} from storage`);
        }
      } catch (error) {
        console.error("Error loading SmartPlay option in VideoList:", error);
      }
    };
    
    loadSmartPlayOption();
  }, []);

  const onSelectVideo = (item: VideoItem) => {
    console.info(`VideoList: Navigating to Player with selected option ID ${selectedOptionId}`);
    navigation.navigate("Player", { 
      video: item, 
      resumePosition: 0,
      selectedSmartPlayOptionId: selectedOptionId 
    });
  };

  return (
    <FlatList
      data={videos}
      renderItem={({ item }) => (
        <VideoListItem item={item} onPress={() => onSelectVideo(item)} />
      )}
      keyExtractor={(item) => item.guid}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
    />
  );
};

const styles = StyleSheet.create({
  itemSeparator: {
    backgroundColor: "#FFFFFF",
    height: 1,
  },
});