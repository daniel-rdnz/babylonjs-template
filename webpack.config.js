const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
  entry: {
    "bundle": "./src/index.js",
    "bundle.min": "./src/game.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "game.js"
  },
  devServer: {
    compress: true,
    //host: '192.168.1.9',
    port: 9000,
  },
  resolve: {
    alias: {
      root: path.resolve(__dirname, '/src') 
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
          test: /\.(woff|woff2|eot|ttf|otf|png)$/,
          loader: 'file-loader',
          options: { outputPath: 'dist/assets/fonts', publicPath: 'dist/assets/fonts'}
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin({
        patterns: [
          { from: './src/assets', to : 'assets' }
        ]
      })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
  devtool: "source-map",
};