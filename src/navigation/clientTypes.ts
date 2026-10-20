import { NativeStackScreenProps } from '@react-navigation/native-stack';
export type ClientStack = {
  Routines: undefined;
  Organizations: undefined;
  Routine: { routineId: string };
  Day: { routineId: string; dayId: string };
  Workout: { sessionId: string };
  History: undefined;
  Profile: undefined;
};
export type ClientScreenProps<T extends keyof ClientStack> =
  NativeStackScreenProps<ClientStack, T>;
