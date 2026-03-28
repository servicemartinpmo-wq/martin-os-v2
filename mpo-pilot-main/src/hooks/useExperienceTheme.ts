import { useEffect } from "react";
import type { UserMode } from "@/hooks/useUserMode";
import {
  applyExperiencePreset,
  getStoredExperiencePresetId,
  resolvePresetForMode,
} from "@/lib/experienceThemes";

export function useExperienceTheme(mode: UserMode): void {
  useEffect(() => {
    const preset = resolvePresetForMode(mode);
    applyExperiencePreset(preset);
  }, [mode]);

  useEffect(() => {
    // Ensure preset exists during initial app load before mode-dependent effects settle.
    applyExperiencePreset(getStoredExperiencePresetId());
  }, []);
}
