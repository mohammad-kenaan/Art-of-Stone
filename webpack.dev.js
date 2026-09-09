import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import common from './webpack.common.js';

const config = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css'
    })
  ],
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,
    compress: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/about$/, to: '/about.html' },
        { from: /^\/services$/, to: '/services.html' },
        { from: /^\/projects$/, to: '/projects.html' },
        { from: /^\/contact$/, to: '/contact.html' },
        { from: /^\/projects\/lakeside$/, to: '/project-lakeside.html' },
        { from: /^\/projects\/ravine$/, to: '/project-ravine.html' },
        { from: /^\/projects\/north$/, to: '/project-north.html' },
        { from: /^\/projects\/commercial$/, to: '/project-commercial.html' }
      ]
    },
    watchFiles: ['src/**/*.html', 'src/**/*.css', 'src/**/*.js']
  }
});

export default config;
