const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    inline: true,
    contentBase: './dist',
    host: '192.168.1.33',
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.js$/, //using regex to tell babel exactly what files to transcompile
        exclude: /node_modules/, // files to be ignored
        use: {
          loader: 'babel-loader', // specify the loader
        },
      },
      {
        test: /\.(s[ac]ss)$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader', // Or `url-loader` or your other loader
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: url => `../fonts/${url}`,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      // bind version of jquery-ui
      'jquery-ui': 'jquery-ui-dist/jquery-ui.js',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.min.css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      filename: 'index.html',
      template: './src/index.html',
      minify: true,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/Storage', to: 'Storage' }],
    }),
  ],
};
