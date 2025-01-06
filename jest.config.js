module.exports = {
preset: 'react-native',
setupFiles: ['<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js'],
setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
},
transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-navigation|@react-native-community|@expo/vector-icons|react-clone-referenced-element|@react-native-picker|react-native-gesture-handler|@react-navigation/elements)',
],
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
},
moduleDirectories: ['node_modules', 'src'],
testEnvironment: 'node',
testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
coveragePathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/__tests__/',
    '/src/types/',
],
globals: {
    'ts-jest': {
    tsconfig: 'tsconfig.json',
    },
},
automock: false,
resetMocks: true,
clearMocks: true,
}
