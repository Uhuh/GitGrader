const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = [
  {
    mode: 'development',
    entry: './src/app.tsx',
    target: 'node',
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

    devServer: {
      historyApiFallback: true,
      contentBase: path.join(__dirname, 'dist'),
      host: 'gitgrader.mst.edu',
      port: 8000
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ],

    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
  }
];