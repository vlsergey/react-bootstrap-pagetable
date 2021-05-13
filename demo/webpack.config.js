/* eslint-disable */

const mode = process.env.NODE_ENV || 'development';
const mainPackageJson = require( '../package.json' );
const path = require( 'path' );
const webpack = require( 'webpack' );

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
  mode: mode,
  target: ["web", "es5"],

  entry: './src/index.tsx',

  module: {
    rules: [
      {
        test: /\.(eot|gif|jpg|png|svg|ttf|woff|woff2)$/,
        use: [ {
          loader: 'url-loader',
          options: {
            limit: process.env.NODE_ENV !== 'development' && 8192, // bytes
          },
        } ],
      },
      {
        test: /\.css$/,
        exclude: /src/,
        include: /node_modules/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: /src/,
        use: [
          MiniCssExtractPlugin.loader,
          '@teamsupercell/typings-for-css-modules-loader',
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        include: /src/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            "declaration": mode == 'development',
            "declarationMap": mode == 'development',
          },
        },
      },
    ],
  },

  resolve: {
    alias: {
        'react': path.resolve(__dirname, '../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
        'react-router': path.resolve(__dirname, '../node_modules/react-router'),
    },
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      buffer: false,
      path: false,
    },
  },

  plugins: [
    new ESLintPlugin( {
      fix: true,
      emitWarning: mode == 'development',
    } ),
    new MiniCssExtractPlugin( {
      filename: mode == 'development' ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: mode == 'development' ? '[id].css' : '[id].[contenthash:8].css',
    } ),
    new webpack.DefinePlugin( {
      VERSION: JSON.stringify( mainPackageJson.version )
    } ),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin( {
      filename: 'index.html',
      template: 'src/index.html',
      version: mainPackageJson.version,
    } ),
  ],

  output: {
    // use subfolder because it is convinient to copy / link whole "dist" folder
    // as java source folder to IDE (or build)
    path: path.join( __dirname, '..', 'docs' ),
  },
};
