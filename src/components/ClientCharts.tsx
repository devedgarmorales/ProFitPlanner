import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { radius, spacing } from '../styles/clientTheme';
import { Icon, usePalette } from './ClientUi';

const BAR_AREA = 96;

export function WeekStrip({
  days,
}: {
  days: { date: string; label: string; count: number }[];
}) {
  const palette = usePalette();
  return (
    <View style={styles.week} accessibilityRole="summary">
      {days.map((day) => (
        <View key={day.date} style={styles.day}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: day.count ? palette.accent : palette.cardAlt,
                borderColor: day.count ? palette.accent : palette.border,
              },
            ]}
          >
            {day.count > 0 && (
              <Icon name="check" size={16} color={palette.onAccent} />
            )}
          </View>
          <Text variant="labelSmall" style={{ color: palette.muted }}>
            {day.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function BarChart({
  points,
  unit,
}: {
  points: { date: string; weight: number }[];
  unit: string;
}) {
  const palette = usePalette();
  if (points.length < 2) {
    return null;
  }
  const max = Math.max(...points.map((point) => point.weight), 1);
  return (
    <View
      accessibilityLabel={`Progresión de carga: ${points
        .map((point) => `${point.weight} ${unit}`)
        .join(', ')}`}
      style={styles.chart}
    >
      {points.map((point, index) => {
        const last = index === points.length - 1;
        return (
          <View key={point.date} style={styles.barColumn}>
            <Text
              variant="labelSmall"
              style={{ color: last ? palette.accent : palette.muted }}
            >
              {point.weight}
            </Text>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(6, (point.weight / max) * BAR_AREA),
                  backgroundColor: last ? palette.accent : palette.border,
                },
              ]}
            />
            <Text variant="labelSmall" style={{ color: palette.muted }}>
              {point.date.slice(8, 10)}/{point.date.slice(5, 7)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { flex: 1, alignItems: 'center', gap: spacing.xs },
  dot: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xs,
    minHeight: BAR_AREA + 40,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bar: { width: '70%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
});
