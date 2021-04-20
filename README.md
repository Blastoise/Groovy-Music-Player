<h1 align="center">
  <br>
  <img src="https://user-images.githubusercontent.com/24838843/115367701-10b75d80-a1e4-11eb-82fa-4cde2f0060bc.png" alt="Groovy-Music-Player-Logo" width="200px"/>
  <br>
  Groovy Music Player
  <br>
</h1>

<h3 align="center">Aesthetic Music Player built on top of <a href="https://www.electronjs.org/" target="_blank">Electron</a>.</h3>

[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

Groovy Music Player is a cross-platform desktop music player built on top of [Electron](https://www.electronjs.org/). It is written in JavaScript and uses [React](https://reactjs.org/).

https://user-images.githubusercontent.com/24838843/115364805-6807fe80-a1e1-11eb-8cde-5240e723bb79.mp4

## ✨ Features

- 📁 Load local .mp3 files from multiple directories.
- ⌛ Load previously added songs instantly when app is re-opened.
- 💫 Animations for clean and easy to use interface.
- 🗄️ Shows meta-data for each song such as title, artist, album, year of release and length of song.
- 🎵 Highlights currently playing song in the list of songs.
- 🔥 Shows Album Art for currently playing song.
- 🎛️ Basic control features such as:
  * Play/Pause.
  * Previous/Next.
  * Shuffle On/Off.
  * Repeat Off/Current/All.
- 🖥️ Full Screen Display for currently playing song.
- 📱 Responsive Design.
- 🚀 Cross platform
  * Windows and Linux ready.
- 🛠️ More features in development.

## 💽 Installation

Download from [GitHub Releases](https://github.com/Blastoise/Groovy-Music-Player/releases) and install it.

## Windows

It is recommended to install Groovy Music Player using the installation package ([Groovy.Music.Player.Setup.0.1.0.exe](https://github.com/Blastoise/Groovy-Music-Player/releases/download/v0.1.0/Groovy.Music.Player.Setup.0.1.0.exe)) for effortless installation.
If you want to build from source code, please read the Build section.

## Linux

You can download the AppImage (for all Linux distributions) to install Groovy Music Player.

### Linux Installation Instructions

- First install cURL using the following command:
  > sudo apt install curl
- Then run the following command to install Groovy Music Player:
  > curl -s https://gist.githubusercontent.com/Blastoise/355eba8386ff025a5b2706c701c2f5b5/raw/bb26c797f69982ecb03d44e2c34793c4a913c91f/install.sh | bash

If you want to build from source code, please read the Build section.

#### AppImage
The latest version of Groovy Music Player AppImage requires you to manually perform desktop integration. Please check the documentation of [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher).

> Desktop Integration
> Since electron-builder 21 desktop integration is not a part of produced AppImage file.
> [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher) is the recommended way to integrate AppImages.

## ⌨️ Development

### Clone Code

```bash
git clone git@github.com:Blastoise/Groovy-Music-Player.git
```

### Install Dependencies

```bash
cd Groovy-Music-Player
npm install
```

### Dev Mode

```bash
npm run electron-dev
```
- For Windows user:
  * Create a file named .env in root of the project and add:
    > BROWSER=none
  * Replace `electron-dev` script in package.json with the following:
    > "electron-dev": "concurrently \\"npm run start\\" \\"wait-on http://localhost:3000 && electron .\\""

### Build Release

```bash
npm run electron-pack
```
- For Windows user:
  * Replace `electron-pack` script in package.json with the following:
    > "electron-pack": "electron-builder -w -c.extraMetadata.main=build/main.js",

After building, the application will be found in the project's `dist` directory.

## 🛠 Technology Stack

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)

## 🤝 Contribute [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)

If you are interested in participating in joint development, PR and Forks are welcome!

## 📜 License

[MIT](https://opensource.org/licenses/MIT) Copyright (c) 2021 Ashutosh Kumar
