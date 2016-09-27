import path from 'path'
import webpack from 'webpack'
import HappyPack from 'happypack'
import pseudoelements from 'postcss-pseudoelements'
import autoprefixer from 'autoprefixer'
import cssmqpacker from 'css-mqpacker'
import csswring from 'csswring'
import CleanPlugin from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SvgStore from 'webpack-svgstore-plugin'

export default {
  cache: true,
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  progress: true,
  entry: {
    docs: './docs/js/index-with-styles.js',
    all: ['./js/index-with-styles.js'],
    jquery: ['./js/jquery/index.js'],
    react: ['./js/react/index.js'],
  },
  output: {
    path: path.resolve(__dirname, '../dist/bundles'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/',
  },
  resolve: {
    modulesDirectories: [
      'less',
      'node_modules',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
      },
      happy: { id: 'js' },
    }, {
      test: /\.less/,
      loader: ExtractTextPlugin.extract('style', [
        'css?importLoaders=2&sourceMap',
        'postcss-loader',
        'less?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
      ]),
      happy: { id: 'css' },
    }],
    noParse: [
      'jquery',
      // 'react',
      // 'react-dom',
      'baconjs',
      'moment',
      'classnames',
      // 'svg4everybody',
      'zeroclipboard',
      // 'iframe-resizer',
      'lunr',
      'slick-carousel',
    ].map((module) => new RegExp(require.resolve(module))),
  },
  plugins: [
    new HappyPack({
      id: 'js',
      cache: true,
      threads: 2,
    }),
    new HappyPack({
      id: 'css',
      cache: true,
      threads: 2,
    }),
    new CleanPlugin([
      path.resolve(__dirname, '../dist/bundles'),
    ], {
      root: path.resolve(__dirname, '..'),
    }),
    new ExtractTextPlugin('[name].css', {
      allChunks: true,
    }),
    new SvgStore({
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      prefix: '',
    }),
  ],
  postcss: () => [
    pseudoelements,
    autoprefixer,
    cssmqpacker({ sort: true }),
    csswring,
  ],
}