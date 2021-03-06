/* jshint node: true */

const webpack = require("webpack");

module.exports = {
  entry: "./js/Main.js",
  output: {
    path: __dirname,
    filename: "./build/bundle.js"
  },
  module: {
    loaders: [
      {loader: "babel-loader", test: /\.js$/}
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
  stats: {
    colors: true,
    progress: true
  },
  devtool: "source-map"
};
