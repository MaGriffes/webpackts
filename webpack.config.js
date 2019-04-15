const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
module.exports={
    mode: 'development',
    devtool: 'cheap-eval-source-map',
    entry: ['babel-polyfill','./src/index.tsx'],/* 入口文件模块路径 这样会在打包的时候提供一个垫脚片用以兼容低版本浏览器中不支持的API（兼容低版本浏览器的一个方法）*/
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        // contentBase: path.join(__dirname, 'src'),
        // compress: true,
        port: 9000,
        open: true,
        hot: true
    },
    module: {
        rules: [
            {
                test:/\.(ts|tsx)$/,
                exclude:/node_modules/,//排除掉node_module目录
                use:[
                    'babel-loader',
                    'ts-loader'
                ]
            },
            {
                test:/\.(js | jsx)$/,
                exclude:/node_modules/,//排除掉node_module目录
                use:[
                    'babel-loader'
                ]
            },
            {
                test: /\.(css|less)$/,
                use: [
                        
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ],
            },
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        })
    ],
    optimization: { //代码分割  详情（https://webpack.docschina.org/plugins/split-chunks-plugin/）
        splitChunks: {
            chunks: 'all', //异步 async  all 同异步 // 同步 initial
            minSize: 30000, 
            maxSize: 0,
            minChunks: 1, //引用次数
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~', //打包文件链接符
            name: true,
            cacheGroups: { //缓存组
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
        }
    }
}