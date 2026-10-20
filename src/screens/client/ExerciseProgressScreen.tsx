import React, { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { ClientScreenProps } from '../../navigation/clientTypes';
import { useHistory } from '../../hooks/client/useHistory';
import {
  ClientLayout,
  clientStyles as styles,
} from '../../components/ClientLayout';
import { ProgressLineChart } from '../../components/ClientCharts';
import {
  EmptyState,
  Pill,
  StatTile,
  Surface,
  usePalette,
} from '../../components/ClientUi';
import {
  exerciseSeries,
  formatSessionDate,
} from '../../services/workoutDisplay';

type Metric = 'weight' | 'oneRm' | 'volume';
type Range = '5' | '10' | 'all';

export function ExerciseProgressScreen({
  route,
}: ClientScreenProps<'ExerciseProgress'>) {
  const { key, name } = route.params;
  const { history } = useHistory();
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const [metric, setMetric] = useState<Metric>('weight');
  const [range, setRange] = useState<Range>('10');
  const unit = key.split(':')[1] || '';
  const series = exerciseSeries(history, key);
  if (!series.length) {
    return (
      <ClientLayout>
        <EmptyState icon="chart-line" title="Sin registros">
          <Text>Todavía no hay series completadas de este ejercicio.</Text>
        </EmptyState>
      </ClientLayout>
    );
  }
  const visible = range === 'all' ? series : series.slice(-Number(range));
  const metricUnit = metric === 'volume' ? `${unit}·rep` : unit;
  const points = visible.map((point) => ({
    date: point.date,
    value: point[metric],
  }));
  const best = series.reduce((top, point) =>
    point.weight > top.weight ? point : top
  );
  const last = series[series.length - 1];
  const first = series[0];
  const change = Math.round((last.weight - first.weight) * 100) / 100;
  return (
    <ClientLayout>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall">{name}</Text>
        <View style={styles.row}>
          <StatTile
            icon="trophy-outline"
            value={`${best.weight}`}
            label={`mejor (${unit})`}
          />
          <StatTile
            icon="clock-outline"
            value={`${last.weight}`}
            label={`última (${unit})`}
          />
          <StatTile
            icon={change >= 0 ? 'trending-up' : 'trending-down'}
            value={change > 0 ? `+${change}` : `${change}`}
            label="desde el inicio"
          />
        </View>
        <Surface>
          <SegmentedButtons
            density="small"
            value={metric}
            onValueChange={(value) => setMetric(value as Metric)}
            buttons={[
              { value: 'weight', label: 'Peso' },
              { value: 'oneRm', label: '1RM' },
              { value: 'volume', label: 'Vol.' },
            ]}
          />
          <ProgressLineChart
            key={`${metric}-${range}`}
            points={points}
            unit={metricUnit}
            width={width - 32}
          />
          <SegmentedButtons
            density="small"
            value={range}
            onValueChange={(value) => setRange(value as Range)}
            buttons={[
              { value: '5', label: '5' },
              { value: '10', label: '10' },
              { value: 'all', label: 'Todo' },
            ]}
          />
        </Surface>
        <Text variant="titleMedium">Registros</Text>
        {[...visible].reverse().map((point) => (
          <Surface key={point.date}>
            <View style={styles.row}>
              <Text style={styles.grow}>{formatSessionDate(point.date)}</Text>
              <Text variant="titleSmall">
                {point.weight} {unit} × {point.reps}
              </Text>
              {point.weight === best.weight && (
                <Pill icon="trophy" tone="warning" label="Récord" />
              )}
            </View>
            <Text variant="bodySmall" style={{ color: palette.muted }}>
              1RM est. {point.oneRm} {unit} · volumen {point.volume}
            </Text>
          </Surface>
        ))}
      </ScrollView>
    </ClientLayout>
  );
}
