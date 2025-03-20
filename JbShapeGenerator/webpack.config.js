const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    entry: './wwwroot/js/my/my_shape_generator.js', // Входной файл
    output: {
        filename: 'bundled_my_shape_generator.js', // Выходной файл
        path: path.resolve(__dirname, 'wwwroot/js'), // Путь вывода
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(), // Минификация JS
            new CssMinimizerPlugin(), // Минификация CSS
        ],
    },
    mode: 'development', // Или 'production' для минификации
    devtool: 'source-map', // Для отладки
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};
