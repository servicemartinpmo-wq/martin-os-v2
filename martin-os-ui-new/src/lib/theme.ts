import { Vibrant } from 'node-vibrant/browser';

export async function extractPalette(imageUrl: string) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
    const colors = {
      primary: palette.Vibrant?.hex || '#3b82f6',
      dark: palette.DarkVibrant?.hex || '#1e3a8a',
      light: palette.LightVibrant?.hex || '#60a5fa',
      muted: palette.Muted?.hex || '#64748b',
    };

    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-pmo-navy', colors.dark);
    root.style.setProperty('--color-pmo-teal', colors.primary);
    root.style.setProperty('--color-pmo-accent', colors.light);
    
    return colors;
  } catch (error) {
    console.error('Failed to extract palette:', error);
    return null;
  }
}
