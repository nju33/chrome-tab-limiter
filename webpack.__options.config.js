const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * @param {any} _
 * @param {Object} argv
 * @param {'development' | 'production' | 'none'} [argv.mode]
 * @returns {import('webpack').Configuration}
 */
module.exports = (_, argv) => {
  return {
    mode: argv.mode || 'development',
    devtool: argv.mode === 'production' ? false : 'cheap-source-map',
    target: 'web',
    entry: {
      options: path.join(__dirname, 'src/options.tsx')
    },
    output: {
      path: path.join(__dirname, 'out'),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.wasm']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/options-template.html'),
        filename: path.join(__dirname, 'out/options.html')
      })
    ]
  }
}
