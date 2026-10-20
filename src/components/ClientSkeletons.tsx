import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { radius, spacing } from '../styles/clientTheme';
import { Surface, usePalette } from './ClientUi';

interface BlockProps {
  height: number;
  width?: number | `${number}%`;
}

export function SkeletonBlock({ height, width = '100%' }: BlockProps) {
  const palette = usePalette();
  const pulse = useSharedValue(0.45);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [pulse]);
  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));
  return (
    <Animated.View
      style={[
        styles.block,
        { height, width, backgroundColor: palette.border },
        animated,
      ]}
    />
  );
}

export function CardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <Surface>
      <SkeletonBlock height={22} width="65%" />
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonBlock key={index} height={14} width={index ? '40%' : '85%'} />
      ))}
    </Surface>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View
      accessibilityLabel="Cargando"
      accessibilityRole="progressbar"
      style={styles.list}
    >
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </View>
  );
}

export function StatsSkeleton() {
  return (
    <View style={styles.stats}>
      <View style={styles.stat}>
        <SkeletonBlock height={84} />
      </View>
      <View style={styles.stat}>
        <SkeletonBlock height={84} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { borderRadius: radius.sm },
  list: { gap: spacing.md },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1 },
});
