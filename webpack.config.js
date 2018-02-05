'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('Extract-text-webpack-plugin');
const webpack = require("webpack");


const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';
const isTest = ENV === 'test' || isTestWatch;
const isProd = ENV === 'build';

let devtool = "";

if (isProd) {
    devtool = 'source-map';
  }
  else if (isTest) {
    devtool = 'inline-source-map';
  }
  else {
    devtool = 'eval-source-map';
  }
console.log(isProd);


module.exports = {
    resolve: {
        extensions: ['.js', '.ts']
    },
    entry: {
        main: "./src/main.ts",
        vendor: "./src/vendor.ts",
        polyfills: "./src/polyfills.ts",
    },
    output: {
        path: root('dist'), // output directory
        filename: "js/[name].[hash].js" // name of the generated bundle
    },
    devtool:devtool,
    module: {
        rules: [
            
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
            },
            {
                test: /\.json$/, 
                loader: 'json-loader'
            },            
            {
                test: /\.css$/,
                exclude: root('src', 'app'),
                loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader']})
            },            
            {
                test: /\.css$/, 
                include: root('src', 'app'), 
                loader: 'raw-loader!postcss-loader'},            
            {
                test: /\.ts$/,
                loaders:["awesome-typescript-loader","angular2-template-loader"] 
            },    
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'app'),
                loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'sass-loader']})
            },        
            {
                test: /\.(scss|sass)$/, 
                exclude: root('src', 'style'), 
                loader: 'raw-loader!postcss-loader!sass-loader'
            },
            {
                test: /\.ts$/,
                enforce: "pre",
                loader: 'tslint-loader'
            },                       
            {
                test: /\.html$/, 
                loader: 'raw-loader',  
                exclude: root('src', 'public')
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
              ENV: JSON.stringify(ENV)
            }
        }),
        new HtmlWebpackPlugin({
            template: "./src/public/index.html",
            chunksSortMode: 'dependency',
            inject: "body"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor','polyfills'],    
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core/,
            root('./src') 
          ),
        new ExtractTextPlugin({
            filename: 'css/[name].[hash].css',
            disable: !isProd
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true, mangle: { keep_fnames: true }}),
    ],
    devServer:{
        contentBase: root('dist'),
        compress: true,               
        stats:"errors-only"
    }

};

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
  }
  