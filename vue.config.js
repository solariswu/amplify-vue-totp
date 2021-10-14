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
          "primary-color": "#a7bfe8",
        },
        javascriptEnabled: true,
      },
    },
  },
  // chainWebpack: (config) => {
  //   config.module
  //     .rule("vue")
  //     .use("vue-loader")
  //     .loader("vue-loader")
  //     .tap((options) => {
  //       options.compilerOptions = {
  //         isCustomElement: (tag) => tag === "ion-icon",
  //       };
  //       return options;
  //     });
  // },
};
