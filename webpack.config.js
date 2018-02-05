'use strict';

var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');


//ENV
const ENV = process.env.npm_lifecycle_event;
let isTestWatch = ENV === 'test-watch';
let isTest = ENV === 'test' || isTestWatch;
let isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    let config = {};

    if(isProd) {
        config.devtool = 'source-map';
    }
    else if(isTest) {
        config.devtool = 'inline-source-map';
    }
    else {
        config.devtool = 'eval-source-map';
    }

    if(!isTest) {
        config.entry = isTest ? {} : {
            'polyfills': './src/polyfills.ts',
            'vendor': './src/vendor.ts',
            'app': './src/main.ts'
        };
    }

    config.output = isTest ? {} : {
        path: root('dist'),
        publicPath: isProd ? '/' : 'http://localhost:8080/',
        filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
        chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
    }

    config.resolve = {
        extensions: ['.ts','.js','.json','.css','.scss','.html'],
    };
    
    let atlOptions = '';

    if(isTest && !isTestWatch) {
        atlOptions = 'inlineSourceMap=true@sourceMap=false';
    }

    config.module = {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?' + atlOptions],
                exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/,/node_modules/]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|tts|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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
              // all css required in src/app files will be merged in js files
              {test: /\.css$/, include: root('src', 'app'), loader: 'raw-loader!postcss-loader'},
        
              // support for .scss files
              // use 'null' loader in test mode (https://github.com/webpack/null-loader)
              // all css in src/style will be bundled in an external css file
              {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'app'),
                loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'sass-loader']})
              },
              // all css required in src/app files will be merged in js files
              {test: /\.(scss|sass)$/, exclude: root('src', 'style'), loader: 'raw-loader!postcss-loader!sass-loader'},
        
              // support for .html as raw text
              // todo: change the loader to something that adds a hash to images
              {test: /\.html$/, loader: 'raw-loader',  exclude: root('src', 'public')}
        ]
    };

    if(isTest || !isTestWatch) {
        config.module.rules.push({
            test: /\.ts$/,
            enforce: 'pre',
            loader: 'tslint-loader'
        });
    }
    config.plugins = [
        new webpack.DefinePlugin({
          // Environment helpers
          'process.env': {
            ENV: JSON.stringify(ENV)
          }
        }),
    
        // Workaround needed for angular 2 angular/angular#11580
        new webpack.ContextReplacementPlugin(
          // The (\\|\/) piece accounts for path separators in *nix and Windows
          /angular(\\|\/)core(\\|\/)@angular/,
          root('./src') // location of your src
        ),
    
        // Tslint configuration for webpack 2
        new webpack.LoaderOptionsPlugin({
          options: {
          
            tslint: {
              emitErrors: false,
              failOnHint: false
            },
           
            sassLoader: {
              //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
            }
          }
        })
      ];


    if(!isTest && !isTestWatch) { 
        config.plugins.push(
            new CommonsChunkPlugin({
                name: ['vendor','polyfills']
            }),
            new HtmlWebpackPlugin({
                template:'./src/public/index.html',
                chunkSortMode: 'dependency'
            }),
            new ExtractTextPlugin({
                filename:'css/[name].[hash].css',
                disable:!isProd
            }),
        );
    }

    if(isProd) {
        config.plugins.push(
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin({sourceMap:true, mangle: {keep_frames: true}}),
            new CopyWebpackPlugin([{
                from : root('src/public')
            }])
        );
    }

    config.devServer = {
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        port:8080,
        open:true,
        stats: 'errors-only'
    }
    return config;
}();

function root(args) { 
    args = Array.prototype.slice.call(arguments,0);
    return path.join.apply(path,[__dirname].concat(args));
}
