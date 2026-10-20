import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { LineChart } from 'react-native-gifted-charts';
import { Text } from 'react-native-paper';
import { radius, spacing } from '../styles/clientTheme';
import { Icon, usePalette } from './ClientUi';

const SPARK_WIDTH = 64;
const SPARK_HEIGHT = 28;

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

export function Sparkline({ values }: { values: number[] }) {
  const palette = usePalette();
  if (values.length < 2) {
    return null;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = SPARK_WIDTH / (values.length - 1);
  const points = values
    .map((value, index) => {
      const x = index * step;
      const y = SPARK_HEIGHT - 4 - ((value - min) / span) * (SPARK_HEIGHT - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const [lastX, lastY] = points.split(' ').pop()!.split(',').map(Number);
  return (
    <Svg width={SPARK_WIDTH} height={SPARK_HEIGHT}>
      <Polyline
        points={points}
        fill="none"
        stroke={palette.accent}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={lastX} cy={lastY} r={3} fill={palette.accent} />
    </Svg>
  );
}

export function ProgressLineChart({
  points,
  unit,
  width,
}: {
  points: { date: string; value: number }[];
  unit: string;
  width: number;
}) {
  const palette = usePalette();
  if (points.length < 2) {
    return (
      <View style={styles.chartEmpty}>
        <Text style={{ color: palette.muted }}>
          Necesitas al menos dos sesiones para ver la tendencia.
        </Text>
      </View>
    );
  }
  const values = points.map((point) => point.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pad = Math.max((max - min) * 0.3, 1);
  const data = points.map((point, index) => ({
    value: point.value,
    label: `${point.date.slice(8, 10)}/${point.date.slice(5, 7)}`,
    labelTextStyle: { color: palette.muted, fontSize: 10, width: 36 },
    dataPointColor:
      index === values.indexOf(max) ? palette.warning : palette.accent,
    dataPointRadius: index === values.indexOf(max) ? 6 : 4,
  }));
  const pointGap = Math.max(36, (width - 70) / Math.max(points.length - 1, 1));
  return (
    <LineChart
      data={data}
      width={width - 56}
      height={170}
      spacing={pointGap}
      initialSpacing={12}
      endSpacing={12}
      yAxisOffset={Math.max(0, Math.floor(min - pad))}
      maxValue={Math.ceil(max + pad) - Math.max(0, Math.floor(min - pad))}
      noOfSections={4}
      curved
      areaChart
      color={palette.accent}
      thickness={3}
      startFillColor={palette.accent}
      endFillColor={palette.card}
      startOpacity={0.35}
      endOpacity={0.02}
      hideRules={false}
      rulesColor={palette.border}
      rulesType="solid"
      yAxisThickness={0}
      xAxisColor={palette.border}
      yAxisTextStyle={{ color: palette.muted, fontSize: 10 }}
      isAnimated
      pointerConfig={{
        pointerStripColor: palette.border,
        pointerColor: palette.accent,
        radius: 6,
        pointerLabelWidth: 96,
        pointerLabelHeight: 44,
        autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: { value: number }[]) => (
          <View style={[styles.tooltip, { backgroundColor: palette.cardAlt }]}>
            <Text style={{ color: palette.accent, fontWeight: '700' }}>
              {items[0].value} {unit}
            </Text>
          </View>
        ),
      }}
    />
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
  chartEmpty: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
});
