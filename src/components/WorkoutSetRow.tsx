import React from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { PrescribedSet, WorkoutSet } from '../interfaces/client';
import { useSetEditor } from '../hooks/client/useWorkout';
import { clientStyles as styles } from './ClientLayout';
interface Props {
  sessionId: string;
  prescribed: PrescribedSet;
  recorded: WorkoutSet;
  disabled: boolean;
}
export const WorkoutSetRow = React.memo(function WorkoutSetRow({
  sessionId,
  prescribed,
  recorded,
  disabled,
}: Props) {
  const form = useSetEditor(sessionId, recorded);
  return (
    <View style={styles.card}>
      <Text variant="titleSmall">
        Serie {prescribed.set_number} · Objetivo: {prescribed.reps} repeticiones
        · {prescribed.target_weight || '—'} {prescribed.weight_unit}
      </Text>
      {!!prescribed.set_notes && <Text>{prescribed.set_notes}</Text>}
      <View style={styles.row}>
        <TextInput
          style={styles.field}
          label="Repeticiones"
          accessibilityLabel={`Repeticiones serie ${prescribed.set_number}`}
          value={form.reps}
          keyboardType="number-pad"
          onChangeText={form.changeReps}
          disabled={disabled}
        />
        <TextInput
          style={styles.field}
          label={`Peso (${prescribed.weight_unit})`}
          value={form.weight}
          keyboardType="decimal-pad"
          onChangeText={form.changeWeight}
          disabled={disabled}
        />
      </View>
      <TextInput
        label="Notas de la serie"
        value={form.notes}
        onChangeText={form.changeNotes}
        disabled={disabled}
        maxLength={2000}
      />
      {!!form.error && (
        <Text accessibilityRole="alert">
          {form.error} El último valor válido sigue guardado.
        </Text>
      )}
      <Button
        mode={recorded.completed ? 'contained' : 'outlined'}
        onPress={form.toggle}
        disabled={disabled || !!form.error}
      >
        {recorded.completed ? 'Serie completada' : 'Marcar completada'}
      </Button>
    </View>
  );
});
