const { TsConfigPathsPlugin } = require("awesome-typescript-loader")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin
const webpack = require("webpack")
const path = require("path")

const sourcePath = path.join(__dirname, "./src")
const outPath = path.join(__dirname, "./public")
const includePaths = [path.join(__dirname, "./src")]

module.exports = function(env) {
  const plugins = []
  let main
  if (env.build) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: "../reports/report.html"
      })
    )

    main = "./src/index.prod.ts"
  } else {
    main = "./src/index.dev.ts"
  }

  const configs = require("./config/" + env.target)
  plugins.push(new webpack.DefinePlugin(configs))

  return {
    devtool: env.build ? undefined : "inline-source-map",
    context: __dirname,
    entry: {
      main
    },
    output: {
      path: outPath,
      publicPath: "/",
      filename: "bundle.js"
    },
    plugins: plugins,
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: [new TsConfigPathsPlugin()]
    },
    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          loaders: ["awesome-typescript-loader"],
          include: includePaths
        },
        {
          test: /\.jsx?$/,
          loaders: ["awesome-typescript-loader"],
          include: includePaths
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.css$/,
          loaders: ["style-loader", "css-loader"]
        }
      ]
    },
    externals: {
      firebase: "firebase",
      firebaseui: "firebaseui",
      rollup: "rollup",
      typescript: "ts",
      // actual name not needed, just that this is an external and it exists
      "monaco-editor": "ts",
      vs: "vs"
    },
    devServer: {
      contentBase: path.join(__dirname, "public"),
      compress: false,
      port: 3000,
      historyApiFallback: {
        index: "index.html"
      }
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
}
