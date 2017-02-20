const path = require('path');

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
          presets: ["env"]
        }
      },
      {
        loader: 'vue-loader',
        test: /\.vue$/,
        // loaders: {
        //   less:
        // }
        // options: {
        //   postcss: [require('')()]
        // }
      }
    ]
  }
}
