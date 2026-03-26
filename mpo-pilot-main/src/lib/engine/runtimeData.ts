import {
  departments as defaultDepartments,
  initiatives as defaultInitiatives,
  actionItems as defaultActionItems,
  insights as defaultInsights,
} from "@/lib/pmoData";
import type {
  Department,
  Initiative,
  ActionItem,
  Insight,
} from "@/lib/pmoData";

export interface EngineDataSnapshot {
  departments: Department[];
  initiatives: Initiative[];
  actionItems: ActionItem[];
  insights: Insight[];
}

// Runtime engine data (mutable for server-side execution).
// Defaults to the existing client-side demo data so current browser behavior stays unchanged.
export let runtimeDepartments: Department[] = defaultDepartments;
export let runtimeInitiatives: Initiative[] = defaultInitiatives;
export let runtimeActionItems: ActionItem[] = defaultActionItems;
export let runtimeInsights: Insight[] = defaultInsights;

export function setRuntimeData(snapshot: EngineDataSnapshot): void {
  runtimeDepartments = snapshot.departments;
  runtimeInitiatives = snapshot.initiatives;
  runtimeActionItems = snapshot.actionItems;
  runtimeInsights = snapshot.insights;
}

