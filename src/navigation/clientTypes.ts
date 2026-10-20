import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ClientTabs = {
  Routines: undefined;
  History: undefined;
  Profile: undefined;
};

export type ClientStack = {
  Tabs: NavigatorScreenParams<ClientTabs> | undefined;
  Organizations: undefined;
  Routine: { routineId: string };
  Day: { routineId: string; dayId: string };
  Workout: { sessionId: string };
  ExerciseProgress: { key: string; name: string };
  SessionDetail: { sessionId: string };
};

export type ClientScreenProps<T extends keyof ClientStack> =
  NativeStackScreenProps<ClientStack, T>;

export type ClientTabScreenProps<T extends keyof ClientTabs> =
  CompositeScreenProps<
    BottomTabScreenProps<ClientTabs, T>,
    NativeStackScreenProps<ClientStack>
  >;
