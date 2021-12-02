const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    console.log(env, argv);

    return {
        entry: path.join(__dirname, './app/index.tsx'),
        output: {
            filename: "bundle/main.js",
            path: path.join(__dirname, './dist')
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { 
                        from:  path.join(__dirname, './public'), 
                        to: path.join(__dirname, './dist'),
                        globOptions: {
                            ignore: [
                                '**/index.html'
                            ]
                        }
                    }
                ]
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.join(__dirname, './public/index.html')
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                    }
                },
            ]
        },
        devtool: argv.mode === 'development' ? 'eval-source-map' : 'source-map'
    };
}