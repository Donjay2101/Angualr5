'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");
const bootstrap = require('./webpack.bootstrap.config.js');
const copywebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';
const isTest = ENV === 'test' || isTestWatch;
const isProd = ENV === 'build';

let bootstrapConfig = isProd ? bootstrap.prod : bootstrap.dev

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
        bootstrap: bootstrapConfig
    },
    output: {
        path: root('dist'), 
        filename: "js/[name].[hash].js" 
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
                loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader','sass-loader']})
            },            
            {
                test: /\.css$/, 
                include: root('src', 'app'), 
                use: ['css-loader', 'raw-loader', 'postcss-loader']
            },
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
            }, 
                    
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
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
        // plugin to remove the warning for core.js in node_modules folder.
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core/,
            root('./src') 
          ),
        new ExtractTextPlugin({
            filename: 'css/[name].[hash].css',
            allChunks:true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true, 
            mangle: { keep_fnames: true }
        }),
        new copywebpackPlugin([{
            from: root('./src/public/')
        }]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
        })
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
  