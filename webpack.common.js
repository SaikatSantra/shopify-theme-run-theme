const path = require('path');
// const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { readdirSync } = require('fs');

/**
 * Specify which scripts folder to include as an entry point. You do not need to specify the files as this will loop
 * through all files and add them as entries.
 */
const foldersToInclude = ['template'];

const entry = {
  'bb-global': './src/scripts/global.js',
  theme: './src/styles/theme.scss'
  // ,
  // 'bb-app-layer': './src/app-layer/index.js'
};

// foldersToInclude.forEach(folder => {
//   readdirSync(`./src/scripts/${folder}`).forEach(
//     file => (entry[`sj-${folder}.${file.replace('.js', '')}`] = `./src/scripts/${folder}/${file}`)
//   );
//   readdirSync(`./src/styles/${folder}`).forEach(
//     file => (entry[`sc-${folder}.${file.replace('.scss', '')}`] = `./src/styles/${folder}/${file}`)
//   );
// });

module.exports = env => {
  const themeDirectory = env.output ? `-${env.output}` : '';
  return {
    target: 'web',
    entry: entry,
    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new StylelintPlugin(),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        fix: true
      }),
      new ForkTsCheckerWebpackPlugin()
    ],
    output: {
      path: path.resolve(__dirname, `./theme${themeDirectory}/assets/`),
      filename: '[name].js'
    },
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(css|scss)/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  plugins: [require('autoprefixer')()]
                }
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    externals: {}
  };
};
