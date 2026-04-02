import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export interface TeamMemberCapacity {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  department: string;
  load_percentage: number;
  status: 'Available' | 'Busy' | 'Ooo' | 'Focus';
  current_task: string;
  last_updated: string;
}

export const useTeamCapacity = () => {
  const [capacityData, setCapacityData] = useState<TeamMemberCapacity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('team_capacity')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Error fetching team capacity:', error);
      } else {
        setCapacityData(data || []);
      }
      setLoading(false);
    };

    fetchInitialData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('team_capacity_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_capacity',
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          if (payload.eventType === 'INSERT') {
            setCapacityData((prev) => [...prev, payload.new as TeamMemberCapacity]);
          } else if (payload.eventType === 'UPDATE') {
            setCapacityData((prev) =>
              prev.map((item) => (item.id === payload.new.id ? (payload.new as TeamMemberCapacity) : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setCapacityData((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { capacityData, loading };
};

export const addTeamMember = async (member: Partial<TeamMemberCapacity>) => {
  const { data, error } = await supabase
    .from('team_capacity')
    .insert([{ ...member, last_updated: new Date().toISOString() }])
    .select();

  if (error) throw error;
  return data?.[0];
};

export const updateMemberCapacity = async (userId: string, updates: Partial<TeamMemberCapacity>) => {
  const { data, error } = await supabase
    .from('team_capacity')
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};
