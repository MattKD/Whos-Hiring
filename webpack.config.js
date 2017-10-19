var config = {
  entry: __dirname + '/src/index.js',
	
  output: {
    path: __dirname + "/public/js",
    filename: 'index.js',
  },
	
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },

  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx"]
  }
}

module.exports = config;
