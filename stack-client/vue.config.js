module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/scss/variables.scss";`,
      },
      scss: {
        prependData: `@import "~@/assets/scss/variables.scss";`,
      },
    },
  },
};
