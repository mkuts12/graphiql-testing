var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: {
    index: './src/app.js'
  },
  output: {
    filename: './public/assets/bin/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.*\.css$/,
        loaders:[ 'style', 'css' ],
      },{
        test: /.*\.(js||jsx)$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0', 'react'],
        },
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
  ]
};
