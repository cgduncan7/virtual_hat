const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './index.tsx',
  },
  target: 'web',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      { test: /\.s[ac]ss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.png$/, loader: 'url-loader', options: { name: 'images/[name].[ext]' }}
    ]
  }
}