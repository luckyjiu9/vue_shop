//这是项目发布阶段用到的插件
const unconsole = []
if (process.env.NODE_ENV === 'production') {
  unconsole.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
module.exports = {
  presets: [
    '@vue/app',
    ["@babel/preset-env", { "modules": false }]
  ],
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //发布产品时候的插件数组
    ...unconsole
  ]
}