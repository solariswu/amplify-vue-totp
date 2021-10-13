// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // options...
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#a7bfe8',
        },
	javascriptEnabled: true
      },
    },
  },
};
