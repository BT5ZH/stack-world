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
    },
  },
};
