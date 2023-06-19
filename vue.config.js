module.exports = {
	publicPath: "./", // 公共路径 默认为"/"，建议使用"./"相对路径
	devServer: { // 本地服务器配置(npm run serve)
		port: 8080, // 端口
		host: "localhost", // 域名
		proxy: {
			"/api": {
				target: "http://localhost:8050", //需要跨域的目标url ,我这里是自己本地起的一个服务端口
				//target: "http://192.168.43.144:8001",
				changeOrigin: true, // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404
				ws: true,
				pathRewrite: {
					"^/api": "" //若请求的路径在目标url下但不在/api 下，则将其转换成空
				}
			}
		}
	},
	lintOnSave: false, // 取消lint语法检测，此处可不配置
	outputDir: "dist", // build打包输出目录
	assetsDir: "assets", // 静态文件输出目录，基于dist
	indexPath: "index.html", // 输出html文件名
	productionSourceMap: false, // 取消.map文件的打包，加快打包速度
	configureWebpack: (config) => {
		// process.env为环境变量，分别对应.env.development文件和.env.production文件 此处表示加快开发环境打包速度
		if (process.env.NODE_ENV !== 'production') return;
		config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true; //生产环境去掉console.log
		return { // 此处配置webpack.config.js的相关配置
			plugins: [],
			performance: {}
		};
	}
};
