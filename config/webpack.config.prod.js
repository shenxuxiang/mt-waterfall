/**
 * 打包整个项目，这个包用于发布到线上 demo
 * npm run pub
*/

const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const webpack = require('webpack');
const env = require('./env');
const { PUBLIC_PATH } = env.raw;

module.exports = {
  mode: 'production',
  bail: true,
	entry: [
    path.resolve('src/index.js'),
  ],
  output: {
    path: path.resolve('build'),
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: '/mt-waterfall' + PUBLIC_PATH,
  },
  optimization: {
    minimize: true,
    minimizer: [
      // 压缩js
      new TerserWebpackPlugin({
        terserOptions: {
          // 解析
          parse: {
            ecma: 8,
          },
          // 压缩
          compress: {
            ecma: 5,
            // 去掉warning
            warnings: false,
          },
          // 输出
          output: {
            ecma: 5,
            // 去掉注视
            comments: false,
            // 解决emoji在prod环境下不能正常显示的问题
            ascii_only: true,
          },
        },
        // 启用文件缓存，缓存的默认目录：node_modules/.cache/terser-webpack-plugin
        cache: true,
        // 使用多进程并行运行来提高构建速度
        parallel: true,
        // 使用源映射将错误消息位置映射到模块（这会减慢编译速度）
        sourceMap: false,
      }),
      // 压缩css
      new OptimizeCssAssetsWebpackPlugin({}),    
    ],
    moduleIds: 'hashed',
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'static': path.resolve('./src/static'),
    },
    modules: [path.resolve('node_modules')],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // 禁止使用后 require.ensure()，因为他不是一个标准语法功能，目前已经被 import() 替代
      { parser: { requireEnsure: false } },
      {
        // 模块的匹配从上到下，只要匹配成功就不再继续往下匹配
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/images/[name].[hash:8].[ext]'
            },
          },
          {
            test: [/\.woff$/, /\.woff2$/, /\.eot$/, /\.ttf$/, /\.otf$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/font/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx)$/,
            loader: require.resolve('babel-loader'),
            include: path.resolve('src'),
            options: {
              presets: [
                ['@babel/preset-env', { modules: false, debug: false, useBuiltIns: 'usage', corejs: 3 }],
                '@babel/preset-react',
              ],
              plugins: [
                ['@babel/plugin-transform-runtime', { 'corejs': 3 }],
                '@babel/plugin-syntax-dynamic-import',
                ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                '@babel/plugin-proposal-export-default-from',
                ['@babel/plugin-proposal-class-properties', { 'loos': true }],
              ],
              // 缓存 babel-loader 的编译结果，默认false
              // webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程
              cacheDirectory: true,
              // 将缓存的 babel-loader 的编译结果进行Gzip压缩， 默认false
              cacheCompression: true,
            },
          },
          {
            test: /\.css$/,
            loaders: [
              MiniCssExtractPlugin.loader,
              require.resolve('css-loader'),
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  plugins: [
                    require('autoprefixer')({
                      "browsers": [
                        "defaults",
                        "not ie < 11",
                        "last 2 versions",
                        "> 1%",
                        "iOS 7",
                        "last 3 iOS versions"
                      ]
                    })
                  ]
                }
              },
            ],
          },
          {
            test: /\.less$/,
            loaders: [
              MiniCssExtractPlugin.loader,
              require.resolve('css-loader'),
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  plugins: [
                    require('autoprefixer')({
                      "browsers": [
                        "defaults",
                        "not ie < 11",
                        "last 2 versions",
                        "> 1%",
                        "iOS 7",
                        "last 3 iOS versions"
                      ]
                    })
                  ]
                }
              },
              require.resolve('less-loader'),
            ],
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
      inject: true,
      filename: 'index.html',
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
  ],
}

