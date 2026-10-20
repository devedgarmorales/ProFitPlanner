jest.mock('react-native-linear-gradient', () => {
  const {View} = require('react-native');
  return {__esModule: true, default: View};
});
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const {Text} = require('react-native');
  return {__esModule: true, default: Text};
});
jest.mock('react-native-reanimated', () => {
  const {View} = require('react-native');
  const animation = {duration: () => animation};
  return {
    __esModule: true,
    default: {View},
    FadeInDown: animation,
    useSharedValue: value => ({value}),
    useAnimatedStyle: factory => factory(),
    withRepeat: value => value,
    withTiming: value => value,
  };
});
