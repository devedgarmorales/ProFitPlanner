module.exports = {
presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
    '@babel/preset-react',
    [
    '@babel/preset-env',
    {
        targets: {
        node: 'current',
        },
    },
    ],
],
plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-private-property-in-object',
],
};
