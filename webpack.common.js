import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AssetPriorityPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("AssetPriorityPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(
        "AssetPriorityPlugin",
        (data) => {
          const getPriority = (tag) => {
            if (tag.tagName === "link" && tag.attributes?.rel === "stylesheet")
              return 0;
            if (tag.tagName === "script") return 2;
            return 1;
          };

          const tuneTag = (tag) => {
            if (
              tag.tagName === "link" &&
              tag.attributes?.rel === "stylesheet"
            ) {
              tag.attributes.fetchpriority = "high";
            }

            if (tag.tagName === "script") {
              tag.attributes.defer = true;
              tag.attributes.fetchpriority = "low";
            }
          };

          data.headTags.forEach(tuneTag);
          data.bodyTags.forEach(tuneTag);
          data.headTags.sort(
            (first, second) => getPriority(first) - getPriority(second),
          );

          return data;
        },
      );
    });
  }
}

const pages = [
  { filename: "index.html", template: "./src/index.html" },
  { filename: "about.html", template: "./src/about.html" },
  { filename: "services.html", template: "./src/services.html" },
  { filename: "projects.html", template: "./src/projects.html" },
  { filename: "contact.html", template: "./src/contact.html" },
  {
    filename: "project-lakeside.html",
    template: "./src/project-lakeside.html",
  },
  { filename: "project-ravine.html", template: "./src/project-ravine.html" },
  { filename: "project-north.html", template: "./src/project-north.html" },
  {
    filename: "project-commercial.html",
    template: "./src/project-commercial.html",
  },
];

const config = {
  entry: "./src/js/index.js",
  output: {
    filename: "assets/js/[name].[contenthash:8].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    //  .for GitHub //
    publicPath: "./",
    //  for development //
    // publicPath: "",
    assetModuleFilename: "assets/media/[name].[contenthash:8][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          sources: true,
          minimize: false,
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff2?|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new AssetPriorityPlugin(),
    ...pages.map(
      ({ filename, template }) =>
        new HtmlWebpackPlugin({
          filename,
          template,
          inject: "head",
          scriptLoading: "defer",
          minify: false,
        }),
    ),
  ],
  resolve: {
    extensions: [".js"],
  },
};

export default config;
