import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
export function clientTheme(dark: boolean) {
  const base = dark ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: dark ? '#b6f23b' : '#3a7d00',
      onPrimary: dark ? '#0a0a0a' : '#ffffff',
      background: dark ? '#0a0a0a' : '#fafafa',
      surface: dark ? '#171717' : '#ffffff',
      secondary: dark ? '#b6f23b' : '#3a7d00',
    },
  };
}
