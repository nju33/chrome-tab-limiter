const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");
const compact = require('lodash.compact');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  resolve: {
    extensions: ['.vue', '.js', '.json', '.jsx', '.css']
  },
  entry: {
    background: './src/scripts/background.js',
    option: './src/scripts/option.js'
  },
  output: {
    path: path.join(__dirname, 'dev/scripts'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          presets: [
            [
              'env', {
                targets: {
                  browsers: ['last 2 chrome versions']
                },
                modules: false
              }
            ]
          ]
        }
      },
      {
        loader: 'vue-loader',
        test: /\.vue$/
      }
    ]
  },
  plugins: compact([
    isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null,
    isProd ? new BabiliPlugin() : null
  ])
}
