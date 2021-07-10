/* craco.config.js */
const CracoLessPlugin = require('craco-less')

// Don't open the browser during development
process.env.BROWSER = "none";


module.exports = {
	webpack: {
		headers: {
			'X-Content-Options': 'Deny',
			'Content-Security-Policy': "frame-ancestors 'self'",
		},
	},
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						javascriptEnabled: true,
					},
				},
			},
		},
	],
}
