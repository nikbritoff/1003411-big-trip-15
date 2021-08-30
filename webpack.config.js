const path = require('path');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration);
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
