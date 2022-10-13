const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {SourceMapDevToolPlugin, ProvidePlugin} = require("webpack");

const config = {
  entry: {
    index: "./web_src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/[name].js",
  },
  devServer: {
    compress: true,
    port: 9000,
    open: true,
    proxy: {
      "/api": "http://localhost:8088",
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-react", {runtime: "automatic"}]]
            }
          }
        ]
      },
      {
        test: /.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        resourceQuery: {not: [/url/]}, // exclude react component if *.svg?url
        use: [
          {
            loader: "@svgr/webpack",
            options: {icon: true},
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }),
    new SourceMapDevToolPlugin({
      filename: "[file].[contenthash:8].map",
      include: ["js/index.js", "css/index.css"],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new ProvidePlugin({
      process: "process/browser.js",
    })
  ],
  performance: {
    hints: false,
    maxEntrypointSize: Infinity,
    maxAssetSize: Infinity,
  }
}

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.mode = "development";
    config.devtool = "eval-source-map";
  }

  if (argv.mode === "production") {
    config.mode = "production";
    config.devtool = "source-map";
  }

  return config;
}
