/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

// This line lets the editor provide autocomplete/suggestions for the config object below
// (like using TypeScript for editor hints)
/** @type {(env: any, arg: {mode: string}) => import('webpack').Configuration} **/
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const isAnalyze = Boolean(env?.analyze)
  /** @type {import('webpack').Configuration} **/
  const config = {
    // How webpack resolves files
    resolve: {
      // Resolve extensions from left to right when importing files with the same
      // base name but different extensions
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    // Entry file for webpack; this file typically imports the rest of the app
    entry: ['./src/index.tsx'],
    // Module rules for webpack
    module: {
      rules: [
        {
          test: /\.tsx?$/, // match .ts and .tsx files
          exclude: /node_modules/,
          use: ['babel-loader'] // transpile TypeScript/React to JavaScript
        },
        {
          test: /\.(s[ac]ss|css)$/, // match .sass, .scss and .css files
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader', // dùng import 'filename.css' trong file tsx, ts
              options: { sourceMap: !isProduction } // enable source maps in development for easier debugging
            },
            {
              loader: 'less-loader', // compile Less to CSS
              options: { sourceMap: !isProduction }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/, // Used to import image files; add other media extensions here if needed
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/media/[name].[contenthash:6].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/, // Used to import font files
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/fonts/[name].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    },

    output: {
      filename: 'static/js/main.[contenthash:6].js', // Add content-based hash to filename to avoid CDN/browser caching
      path: path.resolve(__dirname, 'dist'), // Output build to the dist directory
      publicPath: '/'
    },
    devServer: {
      hot: true, // enable Hot Module Replacement for faster updates
      port: 3000, // serve on port 3000 during development
      historyApiFallback: true, // Must be true to support client-side routing (e.g., lazy-loaded React routes)
      // Cấu hình phục vụ file html trong public
      static: {
        directory: path.resolve(__dirname, 'public', 'index.html'),
        serveIndex: true,
        watch: true // reload when index.html changes
      }
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      // Extract CSS into a separate .css file instead of bundling into JS
      new MiniCssExtractPlugin({
        filename: isProduction ? 'static/css/[name].[contenthash:6].css' : '[name].css'
      }),
      // Load environment variables from a .env file
      new Dotenv(),
      // Copy mọi files trong folder public trừ file index.html
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            filter: (name) => {
              return !name.endsWith('index.html')
            }
          }
        ]
      }),

      // Plugin that injects style and script tags into index.html
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        filename: 'index.html'
      }),
      // Add ESLint integration to webpack
      new ESLintPlugin({
        extensions: ['.tsx', '.ts', '.js', '.jsx']
      })
    ]
  }

  // If building for production, add extra plugins and optimizations
  if (isProduction) {
    config.plugins = [
      ...config.plugins,
      new webpack.ProgressPlugin(), // Show build progress percentage
      // Compress CSS and JS using Brotli (note: sometimes only JS may be compressed depending on content)
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress'
      }),
      new CleanWebpackPlugin() // Clean previous build output directory before building
    ]
    if (isAnalyze) {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
    }
    config.optimization = {
      minimizer: [
        `...`, // Cú pháp kế thừa bộ minimizers mặc định trong webpack 5 (i.e. `terser-webpack-plugin`)
        new CssMinimizerPlugin() // minify css
      ]
    }
  }
  return config
}
