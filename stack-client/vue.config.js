module.exports = {
  publicPath: "/",
  assetsDir: "public",
  devServer: {
    port: 8080,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: false,
    },
    // proxy: {
    //   "/api": {
    //     target: "http://192.168.1.109",
    //     changeOrigin: true,
    //     ws: false,
    //     secure: false,
    //     pathRewrite: {
    //       "^/api": "",
    //     },
    //   },
    // },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/scss/main.scss";`,
      },
      scss: {
        prependData: `@import "~@/assets/scss/main.scss";`,
      },
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#1DA57A",
            "border-color-base": "#CCC",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
