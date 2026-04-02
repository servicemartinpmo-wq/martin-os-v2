import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSignals(workspaceId: string) {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const fetchSignals = async () => {
      const { data, error } = await supabase
        .from('operational_signals')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) setSignals(data);
      setLoading(false);
    };

    fetchSignals();

    const subscription = supabase
      .channel('public:operational_signals')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'operational_signals' }, payload => {
        setSignals(prev => [payload.new, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [workspaceId]);

  return { signals, loading };
}
