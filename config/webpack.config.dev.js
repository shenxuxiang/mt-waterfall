const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const env = require('./env');
const { PUBLIC_PATH } = env.raw;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    path.resolve('src/index'),
  ],
  output: {
    path: path.resolve('dist'),
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: PUBLIC_PATH,
  },
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    // 它的作用是将包含 chunks 映射关系的 list 单独从 index.js里提取出来，
    // 因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，所以你每次改动都会影响它，
    // 如果不将它提取出来的话，等于 index.js 每次都会改变。缓存就失效了。
    // 只有一个入口点时，设置为ture，否则可以设置为'single'或者设置为对象
    // 设置为对象时，只有一个name属性，可以设置为runtimeChunk.name = 'manifest'
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
                ['@babel/preset-env', { modules: false, debug: true, useBuiltIns: 'usage', corejs: 3 }],
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
              cacheCompression: false,
            },
          },
          {
            test: /\.css$/,
            loaders: [
              require.resolve('style-loader'),
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
              require.resolve('style-loader'),
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
  devServer: {
    // 绕开主机检查, 最好不要设置
    disableHostCheck: true,
    // 必须和output中的输出路径一样，不然html模版就找不到资源路径了
    contentBase: path.resolve('dist'),
    // 端口号
    port: 3000,
    // 主机名，如果public没有设置，就会使用host来进行代理
    host: '0.0.0.0',
    // 热更新
    hot: true,
    // 编译失败时在浏览器上展示错误信息
    overlay: true,
    // 自动刷新，
    inline: true,
    // 对所有的资源采用gzip进习压缩，可以极大得提高文件传输的速率，从而提升web性能
    compress: true,
    // 当进程开启时，会自动打开默认浏览器的一个窗口
    open: true,
    // 使用HTML5历史记录
    historyApiFallback: {
      // 禁止使用点路径
      disableDotRule: true,
    },
    // host 和 public 共同存在时既可以使用localhost访问页面也可以使用IP来访问
    public: 'localhost:3000',
    // 表示文件的资源在什么路径下，默认 / 。这里必须和output.publicPath一致
    publicPath: PUBLIC_PATH,
    // 输出捆绑的信息 errors-only 表示只在错误发生时输出
    // stats: 'errors-only',
    // 监听文件变化,监听的文件过多可能会导致CPU和内存被占用
    watchOptions: {
      // 需要忽略的文件或文件路径配置
      // ignoredFiles方法是忽略了 /node_modules/ 目录
      ignored: ignoredFiles(path.resolve('src')),
    },
    // 忽略webpackDevServer自己的日志，因为它通常没啥用。
    clientLogLevel: 'none',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
      inject: true,
      filename: 'index.html',
    }),
    // new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
}
