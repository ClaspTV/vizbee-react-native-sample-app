
import { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import { VizbeeManager } from "react-native-vizbee-sender-sdk";

export type AnalyticsEvent = {
  event: string;
  properties?: any;
};

export const useVizbeeAnalytics = () => {
  const [lastEvent, setLastEvent] = useState<AnalyticsEvent | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  
  const listenerRef = useRef<any>(null);

  const handleAnalyticsEvent = useCallback((eventData: any) => {
    if (!eventData) return;
    
    const analyticsEvent: AnalyticsEvent = {
      event: eventData.event,
      properties: eventData.properties
    };
    
    // Set the last received event
    setLastEvent(analyticsEvent);
    
    // Add to events history
    setEvents(prevEvents => [...prevEvents, analyticsEvent]);
    
    // Log the analytics event
    console.log(`Vizbee Analytics Event: ${analyticsEvent.event}`);
    if (analyticsEvent.properties) {
      console.log(`Event Properties:`, JSON.stringify(analyticsEvent.properties, null, 2));
    }
  }, []);

  useEffect(() => {
    const setupListener = () => {
      if (!listenerRef.current) {
        listenerRef.current = VizbeeManager.addListener(
          "VZB_ANALYTICS_EVENT",
          handleAnalyticsEvent
        );
      }
    };

    setupListener();

    return () => {
      if (listenerRef.current) {
        VizbeeManager.removeListener("VZB_ANALYTICS_EVENT", listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [handleAnalyticsEvent]);

  // Clear all stored events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { 
    lastEvent, 
    events, 
    clearEvents 
  };
};