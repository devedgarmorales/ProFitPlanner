import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { PrescribedSet, WorkoutSet } from '../interfaces/client';
import { useSetEditor } from '../hooks/client/useWorkout';
import { clientStyles as styles } from './ClientLayout';
import { Icon, Surface, ui, usePalette } from './ClientUi';

interface Props {
  sessionId: string;
  prescribed: PrescribedSet;
  recorded: WorkoutSet;
  disabled: boolean;
  previous?: string;
  onCompleted?: () => void;
}

export const WorkoutSetRow = React.memo(function WorkoutSetRow({
  sessionId,
  prescribed,
  recorded,
  disabled,
  previous,
  onCompleted,
}: Props) {
  const form = useSetEditor(sessionId, recorded);
  const palette = usePalette();
  const [showNotes, setShowNotes] = useState(!!recorded.notes);
  const done = recorded.completed;
  const toggle = () => {
    const ok = form.toggle();
    if (ok && !done) {
      onCompleted?.();
    }
  };
  return (
    <Surface
      style={[
        ui.setCard,
        done && {
          borderColor: palette.accent,
          backgroundColor: palette.cardAlt,
        },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            ui.badge,
            { backgroundColor: done ? palette.accent : palette.cardAlt },
          ]}
        >
          <Text style={{ color: done ? palette.onAccent : palette.muted }}>
            {prescribed.set_number}
          </Text>
        </View>
        <View style={styles.grow}>
          <Text variant="titleSmall">
            Serie {prescribed.set_number} · Objetivo: {prescribed.reps}{' '}
            repeticiones · {prescribed.target_weight || '—'}{' '}
            {prescribed.weight_unit}
          </Text>
          {!!previous && (
            <Text variant="labelSmall" style={{ color: palette.muted }}>
              Anterior: {previous}
            </Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            done
              ? `Desmarcar serie ${prescribed.set_number}`
              : `Completar serie ${prescribed.set_number}`
          }
          disabled={disabled || !!form.error}
          onPress={toggle}
          style={[
            ui.check,
            {
              backgroundColor: done ? palette.accent : 'transparent',
              borderColor: done ? palette.accent : palette.border,
            },
          ]}
        >
          <Icon
            name="check"
            size={22}
            color={done ? palette.onAccent : palette.muted}
          />
        </Pressable>
      </View>
      {!!prescribed.set_notes && <Text>{prescribed.set_notes}</Text>}
      <View style={styles.row}>
        <Stepper
          label={`Repeticiones serie ${prescribed.set_number}`}
          caption="Repeticiones"
          value={form.reps}
          onChange={form.changeReps}
          onStep={form.stepReps}
          step={1}
          keyboardType="number-pad"
          disabled={disabled}
        />
        <Stepper
          label={`Peso serie ${prescribed.set_number}`}
          caption={`Peso (${prescribed.weight_unit})`}
          value={form.weight}
          onChange={form.changeWeight}
          onStep={form.stepWeight}
          step={2.5}
          keyboardType="decimal-pad"
          disabled={disabled}
        />
      </View>
      {showNotes ? (
        <TextInput
          mode="outlined"
          dense
          label="Notas de la serie"
          value={form.notes}
          onChangeText={form.changeNotes}
          disabled={disabled}
          maxLength={2000}
        />
      ) : (
        !disabled && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowNotes(true)}
            style={styles.row}
          >
            <Icon name="note-plus-outline" size={16} color={palette.muted} />
            <Text variant="labelMedium" style={{ color: palette.muted }}>
              Agregar nota
            </Text>
          </Pressable>
        )
      )}
      {!!form.error && (
        <Text accessibilityRole="alert" style={{ color: palette.danger }}>
          {form.error} El último valor válido sigue guardado.
        </Text>
      )}
    </Surface>
  );
});

interface StepperProps {
  label: string;
  caption: string;
  value: string;
  onChange: (value: string) => void;
  onStep: (delta: number) => void;
  step: number;
  keyboardType: 'number-pad' | 'decimal-pad';
  disabled: boolean;
}

function Stepper({
  label,
  caption,
  value,
  onChange,
  onStep,
  step,
  keyboardType,
  disabled,
}: StepperProps) {
  const palette = usePalette();
  return (
    <View style={styles.field}>
      <Text variant="labelSmall" style={{ color: palette.muted }}>
        {caption}
      </Text>
      <View style={ui.stepper}>
        <IconButton
          icon="minus"
          size={18}
          accessibilityLabel={`Disminuir ${label}`}
          disabled={disabled}
          onPress={() => onStep(-step)}
        />
        <TextInput
          style={ui.stepperInput}
          dense
          accessibilityLabel={label}
          value={value}
          keyboardType={keyboardType}
          onChangeText={onChange}
          disabled={disabled}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
        />
        <IconButton
          icon="plus"
          size={18}
          accessibilityLabel={`Aumentar ${label}`}
          disabled={disabled}
          onPress={() => onStep(step)}
        />
      </View>
    </View>
  );
}
