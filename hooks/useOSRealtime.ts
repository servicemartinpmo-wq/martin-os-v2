'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useOSRealtime() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    if (!supabase) return;

    // 1. Subscribe to the 'os_alerts' table in real-time
    const channel = supabase
      .channel('os-realtime-engine')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'os_alerts' },
        (payload) => {
          console.log('SIGNAL DETECTED:', payload.new);
          setAlerts((prev) => [payload.new, ...prev].slice(0, 5)); // Keep last 5 alerts
          setLastSync(new Date().toLocaleTimeString());
          
          // Trigger a subtle haptic/audio cue or visual flash
          document.dispatchEvent(new CustomEvent('os-signal-flash'));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { alerts, lastSync };
}
