// electron所有的功能都是通过命名空间暴露出来的
// app => electron.app负责管理electron应用的生命周期
import { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog } from "electron";
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
// const winURL = 'http://www.gengshaobin.top/blog-manage/'
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9088`
    : `file://${__dirname}/index.html`

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
    width: 1035,
    minWidth: 1025,
    minHeight: 700,
    frame: true,
    resizable: true,
    webPreferences: { webSecurity: false } // 允许跨域访问
  });
  // 解决electron网页缩放问题 start
  let webContents=mainWindow.webContents;
  webContents.on('did-finish-load', ()=>{
      webContents.setZoomFactor(1);
      webContents.setVisualZoomLevelLimits(1,1);
      webContents.setLayoutZoomLevelLimits(0,0);
  });
  // 解决electron网页缩放问题 end
  // vue.js devtools
  // BrowserWindow.addDevToolsExtension(
  //   "C:\\Users\\%USERNAME%\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\4.1.5_0"
  // );

  // 加载页面（URL）
  mainWindow.loadURL(winURL);

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 监听窗口关闭
  // mainWindow.on("closed", () => {
  //   // 如果支持多窗口，通常把多个window对象存放在一个数组中，然后在删除相应的元素
  //   mainWindow = null;
  // })

  mainWindow.on('close', (e) => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Information',
      defaultId: 0,
      message: '确定要关闭吗？',
      buttons: ['最小化','直接退出']
    },(index)=>{
      if(index===0){
        e.preventDefault();		//阻止默认行为，一定要有
        mainWindow.minimize();	//调用 最小化实例方法
      } else {
        mainWindow = null;
        //app.quit();	//不要用quit();试了会弹两次
        app.exit();		//exit()直接关闭客户端，不会执行quit();
      }
    }) 
  })

  const isMac = process.platform === 'darwin'
  if (!isMac) {
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
  } else {
    const template = [
      {
        label: '博客管理端',
        submenu: [
          {
            label: '网络',
            click: function() {
              mainWindow.webContents.send('network-set')
            }
          },
          { label: "退出", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
      }
    ]
    // 构建菜单
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
}

// 登录成功（mac）
ipcMain.on('loginSuccess', function() {
  const template = [
    {
      label: '博客管理端',
      submenu: [
        {
          label: '注销',
          click: function() {
            mainWindow.webContents.send('logout')
          }
        },
        { label: "退出", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]
    },
    {
      label: "编辑",
      submenu: [
        { label: "剪切", accelerator: "CommandOrControl+X", selector: "cut:" },
        { label: "拷贝", accelerator: "CommandOrControl+C", selector: "copy:" },
        { label: "复制", accelerator: "CommandOrControl+V", selector: "paste:" },
        { label: "选择全部", accelerator: "CommandOrControl+A", selector: "selectAll:" }
      ]
    }
  ]
  // 构建菜单
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
// 注销（mac）
ipcMain.on('logout', function() {
  const template = [
    {
      label: '博客管理端',
      submenu: [
        {
          label: '网络',
          click: function() {
            mainWindow.webContents.send('network-set')
          }
        },
        { label: "退出", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]
    }
  ]
  // 构建菜单
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

// 以下为需要监听处理的系统事件
// 创建浏览器窗口时调用
app.on("ready", createWindow);
// 全部应用窗口关闭时
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});


// 窗口最大化(window)
ipcMain.on("topWinMax", function() {
  console.log(mainWindow.isMaximized());
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});

// 窗口最小化(window)
ipcMain.on("topWinMin", function() {
  console.log("窗口最小化");
  mainWindow.minimize();
});

// 退出窗口(window)
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
