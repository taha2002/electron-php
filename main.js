const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const electron = require('electron');
const Menu = electron.Menu;
const PHPServer = require('./php');


const server = new PHPServer({
  php: './php/php.exe',
  // php : 'php',
  port: 5555,
  directory: './htdocs/',
  directives: {
    display_errors: 1,
    expose_php: 1
  }
});


function createWindow() {

  server.run();
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/preload.js`
    }
  })

  mainWindow.loadURL('http://' + server.host + ':' + server.port + '/')
  mainWindow.openDevTools();
  server.logOnDevtool(mainWindow)
  const fs = require('fs');
  fs.readFile('htdocs/index.php', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    mainWindow.webContents.send('stderr', data.toString());
  });

  const path = require('path');
  //joining path of directory 
  const directoryPath = path.join(__dirname, 'Documents');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      console.log(file);
      mainWindow.webContents.send('stderr', file);
    });
  });
}


app.on('ready', () => {
  createWindow() // commented for avoiding double window issue
  var template = [{
    label: 'FromScratch',
    submenu: [{
      label: 'Quit',
      accelerator: 'Ctrl+Q',
      click: function () { app.quit(); }
    }]
  }, {
    label: 'Edit',
    submenu: [{
      label: 'Undo',
      accelerator: 'Ctrl+Z',
      selector: 'undo:'
    }, {
      label: 'Redo',
      accelerator: 'Shift+Ctrl+Z',
      selector: 'redo:'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      accelerator: 'Ctrl+X',
      selector: 'cut:'
    }, {
      label: 'Copy',
      accelerator: 'Ctrl+C',
      selector: 'copy:'
    }, {
      label: 'Paste',
      accelerator: 'Ctrl+V',
      selector: 'paste:'
    }, {
      label: 'Select All',
      accelerator: 'Ctrl+A',
      selector: 'selectAll:'
    }]
  }];
  var osxMenu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(osxMenu);

})



app.on('window-all-closed', () => {

  app.quit()

  var pids = server.runingPhpServer()
  pids.forEach(function (pid) {
    // A simple pid lookup
    process.kill(pid);
    console.log('Process %s has been killed!', pid);
  });
})


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})





