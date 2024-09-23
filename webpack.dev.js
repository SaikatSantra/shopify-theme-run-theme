const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  const newCommon = common(env);

  return merge(newCommon, {
    mode: "development",
    // When inspecting, files are unminified
    devtool: "inline-cheap-module-source-map",
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].dev.css`,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        publicPath: "",
        filename: `../snippets/script-tags-dev.liquid`,
        template: path.resolve(__dirname, "./tools/webpack/script-tags.html"),
      }),
    ],
    output: {
      filename: `[name].dev.js`,
    },
  });
};
