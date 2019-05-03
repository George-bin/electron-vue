// electron所有的功能都是通过命名空间暴露出来的
// app => electron.app负责管理electron应用的生命周期
import {
  app,
  BrowserWindow,
  Menu,
  MenuItem
} from 'electron'

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

// 创建窗口
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 800,
    minWidth: 800,
    minHeight: 500,
    maxWidth: 800,
    maxHeight: 500,
    webPreferences: { webSecurity: false } // 允许跨域访问
  })
  // vue.js devtools
  // BrowserWindow.addDevToolsExtension('C:\\Users\\think\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\4.1.5_0');

  // 加载页面（URL）
  mainWindow.loadURL(winURL)

  // 打开开发者工具
  // mainWindow.webContents.openDevTools()

  // 监听窗口关闭
  mainWindow.on('closed', () => {
    // 如果支持多窗口，通常把多个window对象存放在一个数组中，然后在删除相应的元素
    mainWindow = null
  })
}

const menu = new Menu();
menu.append(new MenuItem({
  label: 'Print',
  accelerator: 'CmdOrCtrl+P',
  click: () => { console.log('time to print stuff') }
}))

// 以下为需要监听处理的系统事件

// 创建浏览器窗口时调用
app.on('ready', createWindow)

// 全部应用窗口关闭时
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

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
