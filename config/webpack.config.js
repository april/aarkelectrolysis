const constants = require('../src/js/constants.js');

const BrowserSyncWebpackPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';

const htmlTemplates = [
  ['contact.ejs', 'Contact Us'],
  ['education.ejs', 'Education'],
  ['index.ejs'],
  ['pricing.ejs', 'Pricing'],
  ['services_electrolysis.ejs', 'Electrolysis'],
  ['services_ionic-detoxification.ejs', 'Ionic Detoxification'],
  ['services_led-light-therapy.ejs', 'LED Light Therapy'],
  ['services_wellness.ejs', 'Advanced Wellness']
];

const htmlTemplatePlugins = htmlTemplates.map(i => {
  let filename;
  if (i[0] === 'index.ejs') {
    filename = 'index.html';
  } else {
    filename = `${i[0].replace('.ejs', '').replace('_', '/')}/index.html`;
  }

  const title = i.length === 1 ? constants.name : `${constants.name} :: ${i[1]}`;

  const plugin = new HtmlWebpackPlugin({
    constants,
    filename: filename,
    title,
    template: `src/templates/${i[0]}`,
  });

  return plugin;
});

module.exports = {
  output: {
    crossOriginLoading: 'anonymous',
    library: 'AarkElectrolysis',
    libraryTarget: 'var',
    path: production ? path.resolve(__dirname, '..', 'docs') : path.resolve(__dirname, '..', 'build'),
    filename: '[hash].[name]'
  },
  entry: {
    'index.js': path.resolve(__dirname, '..', 'src', 'js', 'index.js')
  },
  mode: production ? 'production' : 'development',
  devtool: production ? undefined : 'source-map',
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'ejs-compiled-loader'
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '..', 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              '@babel/plugin-proposal-object-rest-spread'
            ],
            presets: [
              ['@babel/preset-env', {
                'targets': {
                  'firefox': 57
                },
                'shippedProposals': true
              }]
            ]
          }
        }]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        //include: path.resolve(__dirname, '..', 'src'),
        use: [{
          loader: MiniCssExtractPlugin.loader
        },
        'css-loader',
        {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        },
        'sass-loader'
      ]}
    ]
  },
  plugins: [
    new CleanWebpackPlugin(
      ['build/*/*/*', 'build/*/*', 'build/*', 'docs/*/*/*', 'docs/*/*', 'docs/*'],
      {
        root: path.resolve(__dirname, '..'),
        verbose: true
      }
    ),
    new CopyWebpackPlugin([
      {
        from: 'src/images',
        to: 'images/',
        flatten: false
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: 'src/files',
        to: 'files/',
        flatten: false
      }
    ]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: '[hash].index.css',
    }),
    ...htmlTemplatePlugins,
    new BrowserSyncWebpackPlugin({
      host: 'localhost',
      port: 5500,
      server: {
        baseDir: 'build'
      }
    })
  ]
};
