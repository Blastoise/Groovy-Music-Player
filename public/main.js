const electron = require("electron");
const fs = require("fs");
const path = require("path");
const dataurl = require("dataurl");
const mp3Duration = require("mp3-duration");
const NodeID3 = require("node-id3");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const isDev = require("electron-is-dev");
const { dialog, ipcMain } = require("electron");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", function () {
  createWindow();
  const template = [];
  // const template = [
  //   {
  //     label: "Sound Control",
  //     submenu: [
  //       {
  //         label: "Select Song",
  //         click: function () {
  //           openFolderDialog();
  //         },
  //       },
  //     ],
  //   },
  // ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

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

ipcMain.on("modal-file-content", (event, arg) => {
  console.log(arg);
  openFolderDialog(event);
});

const getDuration = (filePath) => {
  const durationPromise = new Promise((resolve, reject) => {
    mp3Duration(filePath, (err, duration) => {
      if (duration) {
        resolve(duration);
      } else if (!duration) {
        console.log("Duration mp3 to img error");
        reject("Fuck");
      }
      if (err) {
        reject(err);
      }
    });
  });
  return durationPromise;
};

const getTags = (track) => {
  const { filePath } = track;
  const tagsPromise = new Promise((resolve, reject) => {
    NodeID3.read(filePath, function (err, tags) {
      if (err) {
        reject(err);
      }
      if (tags) {
        // console.log(tags);
        // console.log(tags.image.imageBuffer);
        const imageBuffer = Buffer.from(tags.image.imageBuffer).toString(
          "base64"
        );
        const { title, album, artist } = tags;
        Object.assign(track, { title, artist, album, imageBuffer });
        resolve(track);
      } else {
        console.log("When image file converted to mp3 error");
        reject("Shit");
      }
    });
  });
  return tagsPromise;
};

const createSongObject = (data) => {
  // let songObjectArray = [];
  let promises = [];
  data.forEach((file) => {
    promises.push(
      new Promise((resolve, reject) => {
        getDuration(file.filePath)
          .then((duration) => {
            return Object.assign(file, { duration });
          })
          .then((data) => {
            return getTags(data);
          })
          .then((data) => resolve(data))
          .catch((err) => reject("FUCK"));
      })
    );
  });
  return Promise.all(promises);
  // const songObjectPromise = new Promise((resolve, reject) => {
  //   data.forEach((file) => {
  //     getDuration(file.filePath)
  //       .then((duration) => {
  //         return Object.assign(file, { duration });
  //       })
  //       .then((data) => {
  //         return getTags(data);
  //       })
  //       .then((finalMusic) => {
  //         songObjectArray.push(finalMusic);
  //       });
  //   });
  //   resolve(songObjectArray);
  // });

  // return songObjectPromise;
  // return getDuration(data.filePath)
  //   .then((duration) => {
  //     return Object.assign(data, { duration });
  //   })
  //   .then((data) => {
  //     // console.log(data.duration);
  //     return getTags(data);
  //   });
};

const convertSong = (filesArray) => {
  // let musicFiles = [];
  let promises = [];
  filesArray.forEach((file) => {
    // console.log(file);
    promises.push(
      new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
          if (err) reject(err);
          else {
            resolve({
              music: dataurl.convert({ data, mimetype: "audio/mp3" }),
              filePath: file,
            });
          }
        });
      })
    );
  });
  // const songPromise = new Promise((resolve, reject) => {
  //   filesArray.forEach((file) => {
  //     fs.readFile(file, (err, data) => {
  //       if (err) {
  //         console.log("Error convertSong");
  //         reject(err);
  //       }
  //       musicFiles.push({
  //         music: dataurl.convert({ data, mimetype: "audio/mp3" }),
  //         filePath: file,
  //       });
  // resolve({
  //   music: dataurl.convert({ data, mimetype: "audio/mp3" }),
  //   filePath: filePath,
  // });
  // });
  // });
  // resolve(musicFiles);
  // });
  return Promise.all(promises);
};

const getAllFiles = (filePath) => {
  let filesArray = [];
  const filesPromise = new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) reject(err);
      else {
        // console.log("Filenames with the .txt extension:");
        files.forEach((file) => {
          if (path.extname(file) === ".mp3") {
            // console.log(file);
            filesArray.push(filePath + "/" + file);
          }
        });
        resolve(filesArray);
      }
    });
  });
  return filesPromise;
};

function openFolderDialog(event) {
  dialog
    .showOpenDialog(mainWindow, {
      title: "Open Directory",
      properties: ["openDirectory"],
    })
    .then((result) => {
      console.log(result["filePaths"][0]);
      return getAllFiles(result["filePaths"][0]);
      // return convertSong(result["filePaths"][0]);
    })
    .then((filesArray) => {
      console.log(filesArray);
      return convertSong(filesArray);
    })
    .then((data) => {
      console.log("Crossed Convert song");
      // console.log(data[1].filePath);
      // console.log(data[0].filePath);
      return createSongObject(data);
      // event.sender.send("modal-file-results", data);
      // ipcMain.send("modal-file-results", data);
    })
    .then((data) => {
      // console.log(data[0].title);
      // console.log(data[1].title);
      console.log("done everything");
      event.sender.send("modal-file-results", data);
    })
    .catch((err) => console.log("Error"));
}
