var path = require('path');
var webpack = require('webpack');

module.exports = {
	plugins:[
		new webpack.DllPlugin({
			path: path.join(__dirname, './dist', '[name]-manifest.json'),
			name: '[name]_[hash]'
		})
	],
    entry: {
		vendor: [
            'react-router',
            'react-css-modules',
            'core-decorators',
            'antd',
            'co',
            'draft-js',
            'history',
            'immutable',
            'react',
            'react-css-modules',
            'react-dom',
            'react-router',
            'redux',
            'superagent'
        ]
	},
    output: {
		path: path.resolve(__dirname, './dist'),
        filename: 'dll.[name]_[hash].js',
        library: '[name]_[hash]'
    }
};
