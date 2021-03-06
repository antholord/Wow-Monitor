module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: [
          'github'
        ],
        productName: 'Wow Monitor',
        npmRebuild: false,
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        win: {
          target: [
            'nsis',
            'portable'
          ]
        },
        linux: {
          target: [
            'AppImage'
          ]
        }
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
};
