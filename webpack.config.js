const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin-next");
const DeclarationBundlerPlugin = require("./declaration-bundler-webpack-plugin.fix");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const { NODE_ENV = "production" } = process.env;
module.exports = {
  entry: {
    index: path.resolve(__dirname, "./src/index.ts"),
  },
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true /*ignore typescript error */,
            },
          },
        ],
      },
    ],
  },
  devtool: "source-map",
  externals: [nodeExternals()],
  watch: NODE_ENV === "development",
  plugins: [
    new CleanWebpackPlugin(),
    new UglifyJSPlugin(),
    /* new DeclarationBundlerPlugin({
      moduleName: '"index"',
      out: "@types/index.d.ts",
    }),*/
    new WebpackShellPlugin({
      onBuildEnd: ["yarn run:dev"],
    }),
  ],
};
