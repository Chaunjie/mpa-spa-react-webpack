/**
 * =====================================
 * Created by Chaunjie on 17/3/10.
 * Used for webpack-dev-server
 * Project Verson 0.0.1
 * =====================================
 */
var webpack = require("webpack");
var path = require("path");
var glob = require('glob');

var srcDir = path.resolve(process.cwd(), 'src');

//入口文件定义
var entries = function () {
    var jsDir = path.resolve(srcDir, 'js')
    var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
    var map = {};

    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        //var fileArr = ['webpack/hot/dev-server',  filePath];
        map[filename] = filePath;
    }
    return map;
}

module.exports = {
    entry: entries(),
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                query: {
                    presets: ["react",'es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.coffee']
    },
    devServer: {
        contentBase: './src',
        colors: true,
        historyApiFallback: true,
        inline: true,
        port: 8888,
        process: true,
        hot: false,
        watchOptions         : {
            aggregateTimeout : 50,
            poll             : 1000
        }
    }
}
