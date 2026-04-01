import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export interface ActionDirective {
  id: string;
  title: string;
  detail: string;
  status: 'On Track' | 'Needs Attention' | 'Delayed';
  priority_tier: 1 | 2 | 3;
  mocha_role: string;
  department: string;
  owner_id: string;
  deadline: string;
  initiative_id: string;
  original_message_link: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const useActionDirectives = (category?: string) => {
  const [directives, setDirectives] = useState<ActionDirective[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const fetchDirectives = async () => {
      let query = supabase
        .from('action_directives')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'Action Items') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching action directives:', error);
      } else {
        setDirectives(data || []);
      }
      setLoading(false);
    };

    fetchDirectives();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('action_directives_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'action_directives',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDirectives((prev) => [payload.new as ActionDirective, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDirectives((prev) =>
              prev.map((item) => (item.id === payload.new.id ? (payload.new as ActionDirective) : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setDirectives((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  return { directives, loading };
};

export const createActionDirective = async (directive: Partial<ActionDirective>) => {
  const { data, error } = await supabase
    .from('action_directives')
    .insert([directive])
    .select();

  if (error) throw error;
  return data?.[0];
};

export const updateActionDirective = async (id: string, updates: Partial<ActionDirective>) => {
  const { data, error } = await supabase
    .from('action_directives')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0];
};
