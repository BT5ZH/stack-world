module.exports = {
  publicPath: "/",
  assetsDir: "public",
  devServer: {
    disableHostCheck: true,
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
