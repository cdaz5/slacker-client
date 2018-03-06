module.exports = {
	extends: 'airbnb',
	rules: {
		'react/jsx-filename-extension': 0,
		'no-tabs': 0,
		indent: 0,
		'react/prop-types': 0,
		'jsx-a11y/anchor-is-valid': 0,
	},
	globals: {
		document: 1,
	},
	parser: 'babel-eslint',
	env: {
		browser: 1,
	},
};
