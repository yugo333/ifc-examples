const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: {
    main: "./src/index.js",
  },
  resolve: {
    alias: {
      Redux: path.resolve(__dirname, "src/Redux"),
      Constants: path.resolve(__dirname, "src/Constants"),
      Shared: path.resolve(__dirname, "src/Shared"),
    },
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        oneOf: [
          {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: {
              loader: "file-loader",
              options: {
                name: "[name].[hash].[ext]",
                outputPath: "images",
              },
            },
          },
          { test: /\.(js)$/, exclude: /node_modules/, use: ["babel-loader"] },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "wasm", to: "./wasm" },
        { from: "static", to: "./static" },
      ],
    }),
  ],
};
