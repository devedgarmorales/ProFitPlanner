jest.mock('react-native-linear-gradient', () => {
  const {View} = require('react-native');
  return {__esModule: true, default: View};
});
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const {Text} = require('react-native');
  return {__esModule: true, default: Text};
});
