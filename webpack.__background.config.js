const path = require('path')

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
      background: path.join(__dirname, 'src/background.ts')
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
    }
  }
}
