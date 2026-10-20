import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export function clientPalette(dark: boolean) {
  return {
    accent: dark ? '#b6f23b' : '#3a7d00',
    onAccent: dark ? '#0a0a0a' : '#ffffff',
    gradient: dark ? ['#243a0c', '#0a0a0a'] : ['#3a7d00', '#1f4d00'],
    onGradient: '#ffffff',
    card: dark ? '#171717' : '#ffffff',
    cardAlt: dark ? '#202020' : '#eef3e8',
    border: dark ? '#2a2a2a' : '#e3e8dc',
    muted: dark ? '#9a9a9a' : '#5f6b57',
    success: dark ? '#b6f23b' : '#2e7d32',
    warning: dark ? '#ffb74d' : '#b26a00',
    danger: dark ? '#ff6b6b' : '#c62828',
  };
}

export function clientTheme(dark: boolean) {
  const base = dark ? MD3DarkTheme : MD3LightTheme;
  const palette = clientPalette(dark);
  return {
    ...base,
    roundness: radius.md,
    colors: {
      ...base.colors,
      primary: palette.accent,
      onPrimary: palette.onAccent,
      background: dark ? '#0a0a0a' : '#f6f8f3',
      surface: palette.card,
      surfaceVariant: palette.cardAlt,
      outline: palette.border,
      secondary: palette.accent,
    },
  };
}
