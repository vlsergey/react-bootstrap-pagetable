/* eslint-disable */

const mode = process.env.NODE_ENV || 'development';
const packageJson = require( './package.json' );
const path = require( 'path' );
const webpack = require( 'webpack' );

const ASSET_PATH = process.env.ASSET_PATH || '/';

const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
  mode: mode,

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
        }
      },
      {
        enforce: 'pre',
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        include: /src/,
        loader: 'eslint-loader',
        options: {
          fix: true,
          emitWarning: mode == 'development',
        },
      },
    ],
  },

  resolve: {
    alias: {
        'react': path.resolve(__dirname, '../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    },
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      buffer: false,
      path: false,
    },
  },

  plugins: [
    new MiniCssExtractPlugin( {
      filename: '[name].[chunkhash:8].css',
    } ),
    new webpack.DefinePlugin( {
      VERSION: JSON.stringify( packageJson.version ),
      ASSET_PATH: JSON.stringify( ASSET_PATH ),
    } ),
    new HtmlWebpackPlugin( {
      filename: 'index.html',
      template: 'src/index.html',
      version: packageJson.version,
    } ),
  ],

  output: {
    publicPath: ASSET_PATH,
    // use subfolder because it is convinient to copy / link whole "dist" folder
    // as java source folder to IDE (or build)
    path: path.join( __dirname, 'dist' ),
  },
};
