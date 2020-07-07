# Project Setup - Step by Step

# Fast Way

1. Create package.json file with this content:

```
{
    "name": "setup-practice",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "build": "webpack --config webpack.prod.js",
        "start": "webpack-dev-server --config webpack.dev.js --open"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@babel/cli": "^7.10.4",
        "@babel/core": "^7.10.4",
        "@babel/node": "^7.10.4",
        "@babel/preset-env": "^7.10.4",
        "@babel/register": "^7.10.4",
        "clean-webpack-plugin": "^3.0.0",
        "css-loader": "^3.6.0",
        "eslint": "^7.2.0",
        "eslint-config-airbnb": "^18.2.0",
        "eslint-config-prettier": "^6.11.0",
        "eslint-plugin-import": "^2.22.0",
        "eslint-plugin-jsx-a11y": "^6.3.1",
        "eslint-plugin-prettier": "^3.1.4",
        "eslint-plugin-react": "^7.20.3",
        "eslint-plugin-react-hooks": "^4.0.0",
        "file-loader": "^6.0.0",
        "html-loader": "^1.1.0",
        "html-webpack-plugin": "^4.3.0",
        "mini-css-extract-plugin": "^0.9.0",
        "optimize-css-assets-webpack-plugin": "^5.0.3",
        "prettier": "^2.0.5",
        "style-loader": "^1.2.1",
        "webpack": "^4.43.0",
        "webpack-cli": "^3.3.12",
        "webpack-dev-server": "^3.11.0",
        "webpack-merge": "^4.2.2"
    },
    "dependencies": {
        "babel-loader": "^8.1.0",
        "terser-webpack-plugin": "^3.0.6"
    }
}
```

2. Run `npm install`.

3. Press Ctrl + Shift + P, find Create ESLint config command and run it. Paste this:

```
module.exports = {
    "env": {
        "browser": true,
        "es2020": true,
        "node": true
    },
    "extends": ["airbnb", "prettier"],
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "rules": {
        "import/no-extraneous-dependencies": "off",
    },
    "plugins": ["prettier"],
};
```

4. Create .prettierignore and add .eslintrc.js into it.

5. Create webpack.common.js:

```
module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: 'assets',
                    },
                },
            },
        ],
    },
};
```

6. Create webpack.dev.js:

```
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
});
```

7. Create webpack.prod.js:

```
const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin(),
            new HtmlWebpackPlugin({
                template: './src/template.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                },
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
});
```

8. Create .babelrc.json:

```
{
    "presets": ["@babel/preset-env"]
}
```

9. Create src folder with template.html file in it.

10. Add .gitignore file:

```
node_modules/
dist/
```

# Very Detailed Instruction

## ESLint + Prettier + Airbnb Style Guide

Follow [this](https://github.com/LenaChestnut/ESLint_Prettier_Airbnb_Setup) instruction to set up npm and formatting tools.

## .gitignore

Don't forget to set up .gitignore file to ignore these:

```
node_modules/
dist/
```

## Webpack

### Installation

Install webpack and webpack-cli as devDependencies:

```
npm install --save-dev webpack webpack-cli
```

### File Structure

Webpack looks for an index.js file in src folder by default to use it as an entry point.

```
|-package.json
|-/src
  |-index.js
```

### npm scripts

Add custom scripts to package.json.

```
module.exports = {
  "scripts": {
  "build": "webpack --config webpack.config.js",
  },
};
```

Now, in order to run commands, use `npm run [command name]`.

### Configuration

1. Create webpack.config.js (default name) in the root folder.

2. Default configuration:

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'), // resolve an absolute path using current directory name
    },
};
```

#### Custom configuration

##### Source Maps

If there are errors, browser console will not be pointing to the correct lines in the code. To solve that, add eval-source-map or eval-cheap-source-map (recommended for dev mode) to webpack.config:

```
  devtool: 'eval-source-map',
```

##### Cache Busting

Browsers may use cached files to save time. If the bundled file is named the same as a different already cached file, it may cause errors. To prevent that, set the filename to this:

```
  filename: '[name].[contenthash].js',
```

The content hash part will be updated with each change. Make sure to use HtmlWebpackPlugin so that the files are correctly linked.

##### Separate development and production files

1. Create webpack.dev.js, webpack.prod.js and rename default config file as webpack.common.js.

2. Remove entry properties from dev and prod files. They will share it with the common file. Keep common module rules for file-loader and html-loader.

3. Install webpack-merge package.

```
npm install --save-dev webpack-merge
```

4. Require common file in dev and prod files.

```
const common = require("./webpack.common");
```

5. Add require for webpack-merge package.

```
const merge = require("webpack-merge");
```

6. Merge dev and prod files with webpack.common.js using function call in both files:

```
module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
});
```

7. Install webpack-dev-server package. It allows for automatic opening and updating the app in the browser in dev mode.

```
npm install --save-dev webpack-dev-server
```

8. Go to package.json and edit scripts to include separate commands for running app in development mode and building it for production:

```
    "scripts": {
        "build": "webpack --config webpack.prod.js",
        "start": "webpack-dev-server --config webpack.dev.js --open"
    },
```

## Additional plugins and loaders

### HtmlWebpackPlugin

The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags.

1. Install plugin

```
npm install --save-dev html-webpack-plugin
```

2. Require the plugin in webpack config (dev file, if present):

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
```

3. Add plugin property to the config.

```
plugins: [new HtmlWebpackPlugin( )],
```

4. Create template.html file in src folder with all required html. No need to include script tags or links to stylesheets.

5. Add info about template to plugin:

```
plugins: [new HtmlWebpackPlugin({
  template: "./src/template.html",
})],
```

6. In production config, the following set up can be used:

```
    optimization: {
        minimizer: [
            new HtmlWebpackPlugin({
                template: './src/template.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                },
            }),
        ],
    },
```

### CleanWebpackPlugin

Plugin cleans up old files after new ones are generated.

1. Install plugin.

```
npm install --save-dev clean-webpack-plugin
```

2. Import the plugin into webpack config file (if there is a separate production file, open that one).

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
```

3. Include plugins property into module:

```
plugins: [new CleanWebpackPlugin()],
```

### MiniCssExtractPlugin

This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.

1. Install plugin.

```
npm install --save-dev mini-css-extract-plugin
```

2. Require plugin from webpack config (production file).

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

```

3. Add rules to the module:

```
plugins: [new MiniCssExtractPlugin({filename: "[name].[contenthash].css"})],
```

4. If there are css-loader rules in common config file, move them to dev config.

5. Add module rule to prod config file:

```
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
```

### Optimize CSS Assets Webpack Plugin

The plugin minifies css file which is generated after build is run.

1. Install plugin

```
npm install --save-dev optimize-css-assets-webpack-plugin
```

2. Open webpack production config file. Require the plugin:

```
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
```

3. Add optimization property to module.

```
    optimization: {
        minimizer: [new OptimizeCssAssetsPlugin()],
    },
```

4. The previous step will override default JS minimizer. Add it back by requiring this:

```
const TerserPlugin = require("terser-webpack-plugin");
```

5. Pass it in:

```
    optimization: {
        minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
    },
```

### css-loader and style-loader

**css-loader** can be used to turn css file into JS. It can than be injected into DOM using **style-loader**.

1. Install both loaders and dev dependencies:

```
npm install --save-dev css-loader style-loader
```

2. Add module rules to webpack configuration file. The loaders are used in reverse order, so style-loader should be put first in the 'use' array.

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css\$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
    ],
  },
};
```

3. Import css file to index.js (or another entry point). The css file should be in the src folder.

```
import './style.css';
```

### html-loader and file-loader

Html-loader exports HTML as string. HTML is minimized when the compiler demands. File-loader allows processing images from src and generate correct paths to them.

1. Install html-loader.

```
npm install --save-dev html-loader
```

2. To webpack config file (common one, if present), add the following lines to the module rules:

```
{
  test: /\.html$/,
  use: ["html-loader"]
}
```

3. Install file-loader.

```
npm install --save-dev file-loader
```

4. Add rule for processing images of different types to webpack config. Add options for name and output so that assets are generated in dist folder after build is run.

```
{
  test: /\.(png|svg|jpe?g|gif)$/,
  use: {
    loader: "file-loader",
    options: {
      name: "[name].[hash].[ext]",
      outputPath: "assets",
    }
  },
},
```

### babel-loader

1. Run installation.

```
npm install @babel/cli @babel/core @babel/node @babel/preset-env @babel/register --save-dev
```

2. Install babel-loader.

```
npm install babel-loader
```

3. Create a file called .babelrc.json and add presets to it.

```
{
  "presets": [
    "@babel/preset-env",
  ]
}
```

4. Add loader rules to webpack config file.

```
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['babel-loader']
}
```

## References

-   [ESLint + Prettier + Airbnb Setup](https://github.com/LenaChestnut/ESLint_Prettier_Airbnb_Setup)
-   [Webpack - Getting Started](https://webpack.js.org/guides/getting-started/#modules)
-   [Devtool - Source Maps](https://webpack.js.org/configuration/devtool/)
-   [Learn Webpack Course by Colt Steele](https://www.youtube.com/playlist?list=PLblA84xge2_zwxh3XJqy6UVxS60YdusY8)
-   [Asset Management (CSS)](https://webpack.js.org/guides/asset-management/)
-   [Babel Setup](https://medium.com/@jeffrey.allen.lewis/the-ultimate-2018-webpack-4-and-babel-setup-guide-npm-yarn-dependencies-compared-entry-points-866b577da6a)
