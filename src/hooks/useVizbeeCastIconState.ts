import { useState, useEffect, useRef } from "react";
// @ts-ignore
import { VizbeeManager } from "react-native-vizbee-sender-sdk";

export const useVizbeeCastIconState = () => {
  const [castIconState, setCastIconState] = useState<string>("");
  
  const previousCastIconStateRef = useRef<string | null>(null);
  const listenerRef = useRef<any>(null);

  const handleCastIconStateChange = (eventData: any) => {
    const currentState = eventData?.castIconState;
    
    if (currentState === previousCastIconStateRef.current) {
      return;
    }

    previousCastIconStateRef.current = currentState;
    setCastIconState(currentState);
    
    // Log the cast icon state change
    console.log(`Cast icon state changed to: ${currentState}`);
  };

  useEffect(() => {
    const setupListener = async () => {
      if (!listenerRef.current) {
        listenerRef.current = VizbeeManager.addListener(
          "VZB_CASTICON_STATE",
          handleCastIconStateChange
        );
      }

      try {
        // Get the initial cast icon state using the available API
        const initialState = await VizbeeManager.getCastIconState();
        if (initialState) {
          handleCastIconStateChange({ castIconState: initialState });
        }
      } catch (error) {
        console.warn(`Failed to get Vizbee cast icon state`, error);
      }
    };

    setupListener();

    return () => {
      if (listenerRef.current) {
        VizbeeManager.removeListener("VZB_CASTICON_STATE", listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

  return { castIconState };
};