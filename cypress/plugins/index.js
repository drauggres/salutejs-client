// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
    const options = {
        webpackOptions: {
            resolve: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                alias: {
                    'lib': process.env.CY_MODE==='production' ? path.resolve(__dirname, '../../esm/index') : path.resolve(__dirname, '../../src/index')
                }
            },
            module: {
                rules: [
                    {
                        test: /\.(ts|tsx)$/,
                        loader: 'ts-loader',
                        options: { transpileOnly: true },
                    },
                    {
                        test: /\.css$/,
                        exclude: [/node_modules/],
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.(png|jpe?g|gif)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                            },
                        ],
                    },
                ],
            },
        },
    };

    on('file:preprocessor', webpackPreprocessor(options));

    return config;
};
