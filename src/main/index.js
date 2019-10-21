// electron所有的功能都是通过命名空间暴露出来的
// app => electron.app负责管理electron应用的生命周期
import { app, BrowserWindow, Menu, MenuItem, ipcMain } from "electron";
const electron = require("electron");
const path = require("path");

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9088`
    : `file://${__dirname}/index.html`;

//用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
const Tray = electron.Tray;
//托盘对象
let appTray = null;

// 创建窗口
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 712,
    useContentSize: true,
    width: 1018,
    minWidth: 1018,
    minHeight: 700,
    frame: false,
    resizable: true,
    webPreferences: { webSecurity: false } // 允许跨域访问
  });
  // vue.js devtools
  // BrowserWindow.addDevToolsExtension(
  //   "C:\\Users\\%USERNAME%\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\4.1.5_0"
  // );

  // 加载页面（URL）
  mainWindow.loadURL(winURL);

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 监听窗口关闭
  mainWindow.on("closed", () => {
    // 如果支持多窗口，通常把多个window对象存放在一个数组中，然后在删除相应的元素
    mainWindow = null;
  });

  //系统托盘右键菜单
  let trayMenuTemplate = [
    {
      //系统托盘图标目录
      label: "退出",
      click: function() {
        app.quit();
      }
    }
  ];
  let iconPath = path.join(__static, "/img/logo.png");
  appTray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  // 设置托盘悬浮提示
  appTray.setToolTip("博客管理端");
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu);

  appTray.on("click", function() {
    // 显示主程序
    // mainWindow.show();
    // 关闭托盘显示
    // appTray.destroy();
    if (mainWindow.isVisible()) {
      console.log("窗口最小化了");
      mainWindow.hide();
      // 让窗口不在任务栏中显示
      mainWindow.setSkipTaskbar(true);
    } else {
      mainWindow.show();
      // 让窗口在任务栏中显示
      mainWindow.setSkipTaskbar(false);
    }
  });
}

const menu = new Menu();
menu.append(
  new MenuItem({
    label: "Print",
    accelerator: "CmdOrCtrl+P",
    click: () => {
      console.log("time to print stuff");
    }
  })
);

// 以下为需要监听处理的系统事件

// 创建浏览器窗口时调用
app.on("ready", createWindow);

// 全部应用窗口关闭时
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 窗口最大化
ipcMain.on("topWinMax", function() {
  console.log(mainWindow.isMaximized());
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});

// 窗口最小化
ipcMain.on("topWinMin", function() {
  console.log("窗口最小化");
  mainWindow.minimize();
});

// 退出窗口
ipcMain.on("topWinClose", function(event) {
  // mainWindow.destroy()
  mainWindow.hide();
  mainWindow.setSkipTaskbar(true);
  event.preventDefault();
});

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
