const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = [
  {
    mode: 'development',
    entry: './src/app.tsx',
    target: 'electron-renderer',
    devtool: "source-map",
    module: {
      rules: [{
        test: /\.tsx$/,
        include: /src/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      }]
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'electron.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ]
  }
];