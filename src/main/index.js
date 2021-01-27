import { app, BrowserWindow, dialog, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1000,
    resizable: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  createMenu()
}

function createMenu () {
  /**
   * Remove window menu
   */
  if (process.platform === 'darwin') {
    const template = [{
      label: 'Database Tool',
      submenu: [
        {role: 'about'},
        {role: 'quit'}
      ]
    }]
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    Menu.setApplicationMenu(null)
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
  // if (process.env.NODE_ENV === 'production') {
  //   dialog.showMessageBox({
  //     type: 'info',
  //     title: '软件更新',
  //     message: '发现新版本, 关闭软件时进行更新?',
  //     buttons: ['更新', '取消']
  //   }, (buttonIndex) => {
  //     if (buttonIndex === 0) {
  //       const isSilent = false
  //       const isForceRunAfter = true
  //       autoUpdater.quitAndInstall(isSilent, isForceRunAfter)
  //     } else {
  //       autoUpdater.off()
  //     }
  //   })
  // }
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdatesAndNotify()
})
