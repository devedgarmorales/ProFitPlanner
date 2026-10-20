import React, { useContext } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { clientPalette, radius, spacing } from '../styles/clientTheme';

export function usePalette() {
  return clientPalette(useTheme().dark);
}

interface HeroProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children?: React.ReactNode;
  actions?: { icon: string; label: string; onPress: () => void }[];
}

export function Hero({ title, subtitle, icon, children, actions }: HeroProps) {
  const palette = usePalette();
  const top = useContext(SafeAreaInsetsContext)?.top ?? 0;
  return (
    <LinearGradient
      colors={palette.gradient}
      style={[ui.hero, { paddingTop: ui.hero.paddingTop + top }]}
    >
      <View style={ui.heroTop}>
        <View style={ui.grow}>
          {!!subtitle && (
            <Text style={[ui.heroSubtitle, { color: palette.onGradient }]}>
              {subtitle}
            </Text>
          )}
          <Text
            variant="headlineMedium"
            style={[ui.heroTitle, { color: palette.onGradient }]}
          >
            {title}
          </Text>
        </View>
        {!!icon && !actions && (
          <Icon name={icon} size={36} color={palette.onGradient} />
        )}
        {actions?.map((action) => (
          <Pressable
            key={action.icon}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={action.onPress}
            style={ui.heroAction}
          >
            <Icon name={action.icon} size={22} color={palette.onGradient} />
          </Pressable>
        ))}
      </View>
      {children}
    </LinearGradient>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  const palette = usePalette();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={[ui.track, { backgroundColor: palette.border }]}
    >
      <View
        style={[
          ui.fill,
          {
            width: `${Math.min(100, percent)}%`,
            backgroundColor: palette.accent,
          },
        ]}
      />
    </View>
  );
}

export function StatTile({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  const palette = usePalette();
  return (
    <View
      style={[
        ui.tile,
        { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Icon name={icon} size={20} color={palette.accent} />
      <Text variant="titleLarge" style={ui.tileValue}>
        {value}
      </Text>
      <Text variant="labelSmall" style={{ color: palette.muted }}>
        {label}
      </Text>
    </View>
  );
}

export function Pill({
  icon,
  label,
  tone = 'muted',
}: {
  icon?: string;
  label: string;
  tone?: 'muted' | 'accent' | 'warning';
}) {
  const palette = usePalette();
  const color =
    tone === 'accent'
      ? palette.accent
      : tone === 'warning'
      ? palette.warning
      : palette.muted;
  return (
    <View style={[ui.pill, { backgroundColor: palette.cardAlt }]}>
      {!!icon && <Icon name={icon} size={14} color={color} />}
      <Text variant="labelMedium" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

interface SurfaceProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Surface({
  children,
  onPress,
  style,
  accessibilityLabel,
}: SurfaceProps) {
  const palette = usePalette();
  const body = [
    ui.surface,
    { backgroundColor: palette.card, borderColor: palette.border },
    style,
  ];
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [...body, pressed && ui.pressed]}
    >
      {children}
    </Pressable>
  ) : (
    <View style={body}>{children}</View>
  );
}

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children?: React.ReactNode;
}) {
  const palette = usePalette();
  return (
    <View style={ui.empty}>
      <Icon name={icon} size={48} color={palette.muted} />
      <Text variant="titleMedium">{title}</Text>
      {children}
    </View>
  );
}

export function Avatar({ name }: { name: string }) {
  const palette = usePalette();
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || '?';
  return (
    <View style={[ui.avatar, { backgroundColor: palette.accent }]}>
      <Text variant="headlineSmall" style={{ color: palette.onAccent }}>
        {initials}
      </Text>
    </View>
  );
}

export { Icon };

export const ui = StyleSheet.create({
  center: { textAlign: 'center' },
  centerStack: { alignItems: 'center', gap: 4 },
  checkOn: { backgroundColor: '#00000000' },
  restIdle: { opacity: 0.7 },
  exerciseHeader: { paddingTop: 16, paddingBottom: 8, gap: 4 },
  setCard: { gap: 10 },
  badge: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperInput: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: 'transparent',
    height: 40,
  },
  loginScroll: { flexGrow: 1 },
  cta: { height: 52 },
  footnote: { textAlign: 'center', opacity: 0.7 },
  grow: { flex: 1 },
  hero: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    gap: spacing.md,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroTitle: { fontWeight: '700' },
  heroSubtitle: { opacity: 0.8 },
  heroAction: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  track: { height: 8, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill },
  tile: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  tileValue: { fontWeight: '700' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  surface: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  empty: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
