const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = [
  {
    mode: 'development',
    entry: './src/electron.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.tsx?$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      }]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'electron.js'
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        images: path.join(__dirname, 'src', 'images'),
        modules: path.resolve(__dirname, 'src/modules'),
        stores: path.join(__dirname, 'src', 'stores'),
        api: path.resolve(__dirname, 'src/api'),
        time: path.join(__dirname, 'src', 'time'),
        globals: path.join(__dirname, 'src', 'globals')
      }
    },
  },
  {
    mode: 'development',
    entry: './src/app.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.tsx?$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      }]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ],

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        images: path.join(__dirname, 'src', 'images'),
        modules: path.resolve(__dirname, 'src/modules'),
        stores: path.join(__dirname, 'src', 'stores'),
        api: path.resolve(__dirname, 'src', 'api'),
        time: path.join(__dirname, 'src', 'time'),
        globals: path.join(__dirname, 'src', 'globals')
      }
    },
  }
];