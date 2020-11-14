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
