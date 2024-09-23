const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const getChunkName = require("./tools/webpack/getChunkName");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * Minified Production Builds go here. This is only required if multiple bundles are needed to be created. If you only
 * have 1 entry point, set chunks to an empty object.
 */
const chunks = {};

module.exports = (env) => {
  const newCommon = common(env);
  const themeDirectory = env.output ? `-${env.output}` : "";
  return merge(newCommon, {
    mode: "production",
    // devtool: 'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].min.css",
      }),
      new HtmlWebpackPlugin({
        inject: false,
        publicPath: "",
        filename: `../snippets/script-tags-prod.liquid`,
        template: path.resolve(__dirname, "./tools/webpack/script-tags.html"),
      }),
    ],
    output: {
      path: path.resolve(__dirname, `./theme${themeDirectory}/assets/`),
      filename: "[name].min.js",
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          parallel: true,
          terserOptions: {
            ecma: 6,
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
        name: getChunkName,
      },
    },
  });
};
