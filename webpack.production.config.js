/**
 * =====================================
 * Created by Chaunjie on 17/3/10.
 * Used for webpack-production
 * Project Verson 0.0.1
 * =====================================
 */
var webpack = require("webpack");
var path = require("path");
var glob = require('glob');

var srcDir = path.resolve(process.cwd(), 'src');
var distDir = path.resolve(process.cwd(), 'dist');
var nodeModPath = path.resolve(__dirname, './node_modules');
var pathMap = require('./src/pathmap.json');
var publicPath = '/';

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

//入口文件定义
var entries = function () {
    var jsDir = path.resolve(srcDir, 'js')
    var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
    var map = {};

    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    return map;
};

var html_plugins = function () {
    var entryHtml = glob.sync(srcDir + '/*.html')
    var r = [];
    var entriesFiles = entries();
    for (var i = 0; i < entryHtml.length; i++) {
        var filePath = entryHtml[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        var conf = {
            template: 'html!' + filePath,
            filename: filename + '.html'
        }
        //如果和入口js文件同名
        if (filename in entriesFiles) {
            conf.inject = 'body'
            conf.chunks = ['vendor', filename]
        }
        //跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理;
        if(filename == 'page1'){
            //conf.chunks.splice(1,0,'common-a-b');
            //conf.chunks.push('page2')
        }
        //if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b');
        r.push(new HtmlWebpackPlugin(conf));
    }
    return r
};

var plugins = [];
plugins.push(
    new UglifyJsPlugin({
        compress: {
            warnings: false
        },
        output: {
            comments: false
        }
    }),
    new CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
    }),
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
);

module.exports = {
    entry: Object.assign(entries(), {
        // 用到什么公共lib（例如jquery.js），就把它加进vendor去，目的是将公用库单独提取打包
        'vendor': ['react', 'react-dom']
    }),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: '[chunkhash:8].chunk.js',
        publicPath: publicPath
    },
    resolve: {
        extensions: ['', '.js', '.css', '.scss', '.tpl', '.png', '.jpg'],
        root: [srcDir, nodeModPath],
        alias: pathMap,
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                query: {
                    presets: ["react", 'es2015']
                }
            }
        ]
    },
    plugins: plugins.concat(html_plugins())
    //plugins: plugins.concat(html_plugins())
}
