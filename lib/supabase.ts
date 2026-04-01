/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return undefined;
};

export const supabaseUrl = getEnv('VITE_SUPABASE_URL');
export const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Initialize the Supabase client only if the environment variables are provided
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL'
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'implicit', // Use implicit flow to avoid PKCE issues in iframe popups
      }
    }) 
  : null;

export const isSupabaseConfigured = !!supabase;

export type DiagnosticDimension = 
  | 'Strategy' | 'Operations' | 'Finance' | 'Product' | 'Team' 
  | 'Risk' | 'Growth' | 'Brand' | 'CX' | 'Data_Maturity' 
  | 'Tech_Stack' | 'Sales' | 'Innovation' | 'Scalability' | 'Leadership';

export interface DiagnosticResult {
  id: string;
  dimension: DiagnosticDimension;
  score: number; // 0-100
  framework_used: string; // e.g., 'McKinsey 7S'
  system_id: string; // e.g., 'SYS-009'
}
