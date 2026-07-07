import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoutineTodayScreen from '../screens/routine/RoutineTodayScreen';
import ActiveWorkoutScreen from '../screens/routine/ActiveWorkoutScreen';
import ExerciseSelectionScreen from '../screens/routine/ExerciseSelectionScreen';
import ExerciseHistoryScreen from '../screens/routine/ExerciseHistoryScreen';

const Stack = createStackNavigator();

export default function RoutineStack() {
    return (
        <Stack.Navigator initialRouteName="RoutineToday">
            <Stack.Screen 
                name="RoutineToday" 
                component={RoutineTodayScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="ActiveWorkout" 
                component={ActiveWorkoutScreen} 
                options={{ headerShown: false, presentation: 'modal' }} 
            />
            <Stack.Screen 
                name="ExerciseSelection" 
                component={ExerciseSelectionScreen} 
                options={{ headerShown: false, presentation: 'modal' }} 
            />
            <Stack.Screen 
                name="ExerciseHistory" 
                component={ExerciseHistoryScreen} 
                options={{ headerShown: false, presentation: 'card' }} 
            />
        </Stack.Navigator>
    );
}
