const electron = require("electron");
const fs = require("fs");
const path = require("path");
const dataurl = require("dataurl");
const FileType = require("file-type");
const mp3Duration = require("mp3-duration");
const NodeID3 = require("node-id3");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Store = require("electron-store");
const isDev = require("electron-is-dev");
const { dialog, ipcMain } = require("electron");

const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.maximize();
  mainWindow.show();
  // mainWindow.webContents.openDevTools();
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

ipcMain.on("init-data", (event, args) => {
  event.sender.send("init-data", JSON.stringify(store.store["meta-data"]));
});

ipcMain.on("fetch-song", (event, arg) => {
  console.log(arg);
  getSongDataURI(arg)
    .then((data) => {
      console.log("SONG FETCHED");
      event.sender.send("fetch-song", data);
    })
    .catch((err) => console.log(err));
});

const getSongDataURI = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      else {
        resolve({
          music: dataurl.convert({ data, mimetype: "audio/mp3" }),
        });
      }
    });
  });
};

const getDuration = (filePath) => {
  const durationPromise = new Promise((resolve, reject) => {
    mp3Duration(filePath, (err, duration) => {
      if (err) {
        console.log("ERROR! Reading File in getDuration");
        return reject(err);
      }
      if (duration) {
        return resolve(duration);
      } else {
        console.log("ERROR! Duration property is not present in file");
        return reject("ERROR! Duration property is not present in file");
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
        console.log("ERROR! Reading File in getTags");
        return reject(err);
      }
      if (tags) {
        let imageBuffer;

        if (tags.image && tags.image.imageBuffer) {
          imageBuffer = Buffer.from(tags.image.imageBuffer).toString("base64");
        }

        const { title, album, artist, year } = tags;
        Object.assign(track, {
          title,
          artist,
          album,
          year,
          imageBuffer,
        });
        return resolve(track);
      } else {
        console.log("ERROR! Tags property not present in file");
        return reject("ERROR! Tags property not present in file");
      }
    });
  });
  return tagsPromise;
};

const createSongObject = (data) => {
  let promises = [];
  data.forEach((file) => {
    promises.push(
      new Promise((resolve, reject) => {
        getDuration(file.filePath)
          .then((duration) => {
            let mins = Math.floor(Math.floor(duration) / 60);
            let secs = duration - mins * 60;
            secs = Math.ceil(secs);
            secs = secs < 10 ? `0${secs}` : secs;
            let songDuration = `${mins}:${secs}`;

            return Object.assign(file, { songDuration });
          })
          .then((data) => {
            return getTags(data);
          })
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      })
    );
  });

  return Promise.allSettled(promises);
};

const checkMp3 = (filesArray) => {
  let promises = [];
  filesArray.forEach((file) => {
    promises.push(
      new Promise((resolve, reject) => {
        FileType.fromFile(file)
          .then((data) => {
            if (data && data.ext === "mp3") {
              resolve({ filePath: file });
            } else {
              console.log(`ERROR in file ${file}`);
              reject(`ERROR!! ${file} is not a MP3 file`);
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
    );
  });
  return Promise.allSettled(promises);
};

const getAllFiles = (filePath) => {
  let filesArray = [];
  const filesPromise = new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) reject(err);
      else {
        files.forEach((file) => {
          if (path.extname(file) === ".mp3") {
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
    })
    .then((filesArray) => {
      return checkMp3(filesArray);
    })
    .then((data) => {
      let filesArray = [];
      data.forEach((result) => {
        if (result.status === "fulfilled") {
          filesArray.push(result.value);
        }
      });
      console.log(filesArray.length);
      return filesArray;
    })
    .then((data) => {
      console.log("Crossed Convert song");
      return createSongObject(data);
    })
    .then((data) => {
      let filesArray = [];
      data.forEach((result) => {
        if (result.status === "fulfilled") {
          console.log(result.value.filePath);
          // console.log(
          //   `${result.value.title} **** ${result.value.artist} **** ${result.value.album} **** ${result.value.year} **** ${result.value.genre} **** ${result.value.filePath}`
          // );

          filesArray.push(result.value);
        }
      });
      store.set("meta-data", filesArray);
      console.log(filesArray.length);
      return filesArray;
    })
    .then((data) => {
      console.log("done everything");
      event.sender.send("modal-file-results", data);
    })
    .catch((err) => console.log(err));
}
